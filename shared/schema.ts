import { pgTable, text, serial, integer, boolean, timestamp, numeric } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  email: text("email").notNull().unique(),
  password: text("password").notNull(),
  role: text("role").default("user").notNull(),
  name: text("name"),
  phone: text("phone"),
  address: text("address"),
  city: text("city"),
  enabled: boolean("enabled").default(true).notNull(),
  createdAt: timestamp("created_at").defaultNow(),
});

export const categories = pgTable("categories", {
  id: serial("id").primaryKey(),
  nameAr: text("name_ar").notNull(),
  nameEn: text("name_en").notNull(),
  slug: text("slug").notNull().unique(),
});

export const books = pgTable("books", {
  id: serial("id").primaryKey(),
  titleAr: text("title_ar").notNull(),
  titleEn: text("title_en").notNull(),
  author: text("author").notNull(),
  descriptionAr: text("description_ar").notNull(),
  descriptionEn: text("description_en").notNull(),
  price: numeric("price").notNull(),
  category: text("category").notNull(),
  categoryId: integer("category_id"),
  image: text("image").notNull(),
  language: text("language").notNull(),
  published: boolean("published").default(true).notNull(),
  isbn: text("isbn"),
  stock: integer("stock").default(0).notNull(),
  createdAt: timestamp("created_at").defaultNow(),
});

export const wilayas = pgTable("wilayas", {
  id: serial("id").primaryKey(),
  code: integer("code").notNull().unique(),
  nameAr: text("name_ar").notNull(),
  nameEn: text("name_en").notNull(),
  shippingPrice: numeric("shipping_price").notNull(),
  isActive: boolean("is_active").default(true).notNull(),
});

export const orders = pgTable("orders", {
  id: serial("id").primaryKey(),
  userId: integer("user_id"),
  customerName: text("customer_name").notNull(),
  phone: text("phone").notNull(),
  address: text("address").notNull(),
  city: text("city").notNull(),
  wilayaCode: integer("wilaya_code"),
  wilayaName: text("wilaya_name"),
  baladiya: text("baladiya"),
  shippingPrice: numeric("shipping_price"),
  status: text("status").default("pending").notNull(),
  total: numeric("total").notNull(),
  notes: text("notes"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const orderItems = pgTable("order_items", {
  id: serial("id").primaryKey(),
  orderId: integer("order_id").notNull(),
  bookId: integer("book_id").notNull(),
  quantity: integer("quantity").notNull(),
  unitPrice: numeric("unit_price").notNull(),
});

export const activityLogs = pgTable("activity_logs", {
  id: serial("id").primaryKey(),
  adminId: integer("admin_id").notNull(),
  adminEmail: text("admin_email").notNull(),
  action: text("action").notNull(),
  entityType: text("entity_type"),
  entityId: integer("entity_id"),
  details: text("details"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const sitePages = pgTable("site_pages", {
  id: serial("id").primaryKey(),
  slug: text("slug").notNull().unique(),
  titleAr: text("title_ar").notNull().default(""),
  titleEn: text("title_en").notNull().default(""),
  contentAr: text("content_ar").notNull().default(""),
  contentEn: text("content_en").notNull().default(""),
  imageUrl: text("image_url"),
  extraData: text("extra_data"),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const reviews = pgTable("reviews", {
  id: serial("id").primaryKey(),
  bookId: integer("book_id").notNull(),
  userId: integer("user_id"),
  userName: text("user_name").notNull(),
  rating: integer("rating").notNull(),
  comment: text("comment"),
  approved: boolean("approved").default(true).notNull(),
  createdAt: timestamp("created_at").defaultNow(),
});

export const blogPosts = pgTable("blog_posts", {
  id: serial("id").primaryKey(),
  titleAr: text("title_ar").notNull(),
  titleEn: text("title_en").notNull(),
  contentAr: text("content_ar").notNull(),
  contentEn: text("content_en").notNull(),
  imageUrl: text("image_url"),
  published: boolean("published").default(true).notNull(),
  createdAt: timestamp("created_at").defaultNow(),
});

// === INSERT SCHEMAS ===

export const insertUserSchema = createInsertSchema(users).pick({
  email: true,
  password: true,
  role: true,
  name: true,
  phone: true,
  address: true,
  city: true,
});

export const registerUserSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
  name: z.string().min(2),
  phone: z.string().optional(),
});

export const insertBookSchema = createInsertSchema(books).omit({
  id: true,
  createdAt: true,
});

export const insertCategorySchema = createInsertSchema(categories).omit({
  id: true,
});

export const insertWilayaSchema = createInsertSchema(wilayas).omit({
  id: true,
});

export const insertOrderSchema = z.object({
  customerName: z.string().min(2),
  phone: z.string().min(8),
  address: z.string().min(5),
  city: z.string().min(2),
  wilayaCode: z.number().optional(),
  wilayaName: z.string().optional(),
  baladiya: z.string().optional(),
  notes: z.string().optional(),
  items: z.array(z.object({
    bookId: z.number(),
    quantity: z.number().min(1),
  })).min(1),
});

export const insertActivityLogSchema = createInsertSchema(activityLogs).omit({
  id: true,
  createdAt: true,
});

export const insertSitePageSchema = createInsertSchema(sitePages).omit({
  id: true,
  updatedAt: true,
});

export const insertReviewSchema = z.object({
  bookId: z.number(),
  rating: z.number().min(1).max(5),
  comment: z.string().optional(),
});

export const insertBlogPostSchema = createInsertSchema(blogPosts).omit({
  id: true,
  createdAt: true,
});

// === TYPES ===

export type User = typeof users.$inferSelect;
export type InsertUser = z.infer<typeof insertUserSchema>;
export type RegisterUser = z.infer<typeof registerUserSchema>;

export type Book = typeof books.$inferSelect;
export type InsertBook = z.infer<typeof insertBookSchema>;

export type Category = typeof categories.$inferSelect;
export type InsertCategory = z.infer<typeof insertCategorySchema>;

export type Wilaya = typeof wilayas.$inferSelect;
export type InsertWilaya = z.infer<typeof insertWilayaSchema>;

export type Order = typeof orders.$inferSelect;
export type OrderItem = typeof orderItems.$inferSelect;
export type InsertOrder = z.infer<typeof insertOrderSchema>;

export type ActivityLog = typeof activityLogs.$inferSelect;
export type InsertActivityLog = z.infer<typeof insertActivityLogSchema>;

export type SitePage = typeof sitePages.$inferSelect;
export type InsertSitePage = z.infer<typeof insertSitePageSchema>;

export type Review = typeof reviews.$inferSelect;
export type InsertReview = z.infer<typeof insertReviewSchema>;

export type BlogPost = typeof blogPosts.$inferSelect;
export type InsertBlogPost = z.infer<typeof insertBlogPostSchema>;

export type UpdateBookRequest = Partial<InsertBook>;
export type BookResponse = Book;

export type OrderWithItems = Order & { items: (OrderItem & { book?: Book })[] };
