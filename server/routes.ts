import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { setupAuth } from "./auth";
import { api } from "@shared/routes";
import { z } from "zod";

export async function registerRoutes(
  httpServer: Server,
  app: Express
): Promise<Server> {
  // Setup Auth
  const { hashPassword } = setupAuth(app);

  // === AUTH API ===
  app.post(api.auth.register.path, async (req, res) => {
    try {
      const input = api.auth.register.input.parse(req.body);
      const existing = await storage.getUserByUsername(input.email);
      if (existing) {
        return res.status(400).json({ message: "Username already exists" });
      }

      const hashedPassword = await hashPassword(input.password);
      const user = await storage.createUser({
        ...input,
        password: hashedPassword,
      });
      
      req.login(user, (err) => {
        if (err) return res.status(500).json({ message: "Login failed" });
        res.status(201).json(user);
      });
    } catch (err) {
      if (err instanceof z.ZodError) {
        res.status(400).json({ message: err.errors[0].message });
      } else {
        res.status(500).json({ message: "Internal server error" });
      }
    }
  });

  app.post(api.auth.login.path, (req, res, next) => {
    // Basic validation
    const result = api.auth.login.input.safeParse(req.body);
    if (!result.success) {
       return res.status(400).json({ message: "Invalid input" });
    }
    next();
  }, (req, res, next) => {
    // Passport login
    const passportLogin = (global as any).passport?.authenticate("local", (err: any, user: any, info: any) => {
      if (err) return next(err);
      if (!user) return res.status(401).json({ message: "Invalid credentials" });
      req.login(user, (err) => {
        if (err) return next(err);
        res.status(200).json(user);
      });
    });
    // Dynamically require passport if global doesn't work (it should if imported in auth.ts and auth.ts is imported here)
    // Actually, we imported setupAuth which imports passport.
    // Better way: use the import from auth.ts
    const passport = require("passport");
    passport.authenticate("local", (err: any, user: any, info: any) => {
      if (err) return next(err);
      if (!user) return res.status(401).json({ message: "Invalid credentials" });
      req.login(user, (err) => {
        if (err) return next(err);
        res.json(user);
      });
    })(req, res, next);
  });

  app.post(api.auth.logout.path, (req, res) => {
    req.logout((err) => {
      if (err) return res.status(500).json({ message: "Logout failed" });
      res.status(200).send();
    });
  });

  app.get(api.auth.me.path, (req, res) => {
    if (req.isAuthenticated()) {
      res.json(req.user);
    } else {
      res.json(null);
    }
  });


  // === BOOKS API ===

  app.get(api.books.list.path, async (req, res) => {
    const category = req.query.category as string | undefined;
    const search = req.query.search as string | undefined;
    const books = await storage.getBooks(category, search);
    res.json(books);
  });

  app.get(api.books.get.path, async (req, res) => {
    const book = await storage.getBook(Number(req.params.id));
    if (!book) return res.status(404).json({ message: "Book not found" });
    res.json(book);
  });

  app.post(api.books.create.path, async (req, res) => {
    if (!req.isAuthenticated() || (req.user as any).role !== "admin") {
      return res.status(401).json({ message: "Unauthorized" });
    }
    try {
      const input = api.books.create.input.parse(req.body);
      const book = await storage.createBook(input);
      res.status(201).json(book);
    } catch (err) {
      if (err instanceof z.ZodError) {
        res.status(400).json({ message: "Validation error" });
      } else {
        res.status(500).json({ message: "Server error" });
      }
    }
  });

  app.put(api.books.update.path, async (req, res) => {
    if (!req.isAuthenticated() || (req.user as any).role !== "admin") {
      return res.status(401).json({ message: "Unauthorized" });
    }
    try {
      const input = api.books.update.input.parse(req.body);
      const updated = await storage.updateBook(Number(req.params.id), input);
      res.json(updated);
    } catch (err) {
      res.status(400).json({ message: "Update failed" });
    }
  });

  app.delete(api.books.delete.path, async (req, res) => {
    if (!req.isAuthenticated() || (req.user as any).role !== "admin") {
      return res.status(401).json({ message: "Unauthorized" });
    }
    await storage.deleteBook(Number(req.params.id));
    res.status(204).send();
  });

  // Seed Data
  await seedDatabase(hashPassword);

  return httpServer;
}

async function seedDatabase(hashPassword: (pwd: string) => Promise<string>) {
  const users = await storage.getUserByUsername("admin@daralibenzid.com");
  if (!users) {
    console.log("Seeding database...");
    const adminPwd = await hashPassword("admin123");
    await storage.createUser({
      email: "admin@daralibenzid.com",
      password: adminPwd,
      role: "admin"
    });

    const userPwd = await hashPassword("user123");
    await storage.createUser({
      email: "user@example.com",
      password: userPwd,
      role: "user"
    });
    
    // Seed Books
    await storage.createBook({
      titleAr: "مقدمة ابن خلدون",
      titleEn: "The Muqaddimah",
      author: "Ibn Khaldun",
      descriptionAr: "كتاب العبر وديوان المبتدأ والخبر في أيام العرب والعجم والبربر ومن عاصرهم من ذوي السلطان الأكبر.",
      descriptionEn: "The Muqaddimah, often translated as 'Introduction' or 'Prolegomenon', is the most important Islamic history of the premodern world.",
      price: "2500",
      category: "History",
      image: "https://images.unsplash.com/photo-1544947950-fa07a98d237f?auto=format&fit=crop&q=80&w=800",
      language: "both",
      published: true,
      isbn: "978-0691174954"
    });

    await storage.createBook({
      titleAr: "ألف ليلة وليلة",
      titleEn: "One Thousand and One Nights",
      author: "Unknown",
      descriptionAr: "مجموعة قصصية تراثية من الشرق الأوسط.",
      descriptionEn: "A collection of Middle Eastern folk tales compiled in Arabic during the Islamic Golden Age.",
      price: "3000",
      category: "Literature",
      image: "https://images.unsplash.com/photo-1512820790803-83ca734da794?auto=format&fit=crop&q=80&w=800",
      language: "ar",
      published: true,
      isbn: "978-1234567890"
    });
    
     await storage.createBook({
      titleAr: "البؤساء",
      titleEn: "Les Misérables",
      author: "Victor Hugo",
      descriptionAr: "رواية فرنسية تاريخية من تأليف فيكتور هوجو.",
      descriptionEn: "A French historical novel by Victor Hugo, considered one of the greatest novels of the 19th century.",
      price: "1800",
      category: "Fiction",
      image: "https://images.unsplash.com/photo-1532012197267-da84d127e765?auto=format&fit=crop&q=80&w=800",
      language: "both",
      published: true,
      isbn: "978-0451419439"
    });
  }
}
