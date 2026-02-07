import { db } from "./db";
import {
  users, books, categories, orders, orderItems, activityLogs, wilayas,
  sitePages, reviews, blogPosts,
  type User, type InsertUser,
  type Book, type InsertBook, type UpdateBookRequest,
  type Category, type InsertCategory,
  type Order, type OrderItem, type OrderWithItems,
  type Wilaya, type InsertWilaya,
  type ActivityLog, type InsertActivityLog,
  type SitePage, type InsertSitePage,
  type Review,
  type BlogPost, type InsertBlogPost
} from "@shared/schema";
import { eq, desc, sql, and, avg } from "drizzle-orm";
import session from "express-session";
import connectPg from "connect-pg-simple";
import { pool } from "./db";

const PostgresSessionStore = connectPg(session);

export interface IStorage {
  sessionStore: session.Store;

  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  getUsers(): Promise<User[]>;
  updateUser(id: number, updates: Partial<User>): Promise<User>;

  getBooks(category?: string, search?: string): Promise<Book[]>;
  getBook(id: number): Promise<Book | undefined>;
  createBook(book: InsertBook): Promise<Book>;
  updateBook(id: number, updates: UpdateBookRequest): Promise<Book>;
  deleteBook(id: number): Promise<void>;
  countBooks(): Promise<number>;
  countLowStockBooks(): Promise<number>;

  getCategories(): Promise<Category[]>;
  getCategory(id: number): Promise<Category | undefined>;
  createCategory(cat: InsertCategory): Promise<Category>;
  updateCategory(id: number, updates: Partial<InsertCategory>): Promise<Category>;
  deleteCategory(id: number): Promise<void>;

  getWilayas(): Promise<Wilaya[]>;
  getActiveWilayas(): Promise<Wilaya[]>;
  getWilayaByCode(code: number): Promise<Wilaya | undefined>;
  getWilaya(id: number): Promise<Wilaya | undefined>;
  createWilaya(w: InsertWilaya): Promise<Wilaya>;
  updateWilaya(id: number, updates: Partial<Wilaya>): Promise<Wilaya>;
  countWilayas(): Promise<number>;

  createOrder(userId: number | null, customerName: string, phone: string, address: string, city: string, notes: string | undefined, total: number, items: { bookId: number; quantity: number; unitPrice: number }[], wilayaCode?: number, wilayaName?: string, baladiya?: string, shippingPrice?: number): Promise<OrderWithItems>;
  getOrders(): Promise<OrderWithItems[]>;
  getOrder(id: number): Promise<OrderWithItems | undefined>;
  getUserOrders(userId: number): Promise<OrderWithItems[]>;
  updateOrderStatus(id: number, status: string): Promise<Order>;
  deleteOrder(id: number): Promise<void>;
  countOrders(): Promise<number>;
  totalRevenue(): Promise<number>;

  deleteUser(id: number): Promise<void>;

  logActivity(log: InsertActivityLog): Promise<ActivityLog>;
  getActivityLogs(limit?: number): Promise<ActivityLog[]>;

  getPageBySlug(slug: string): Promise<SitePage | undefined>;
  upsertPage(slug: string, data: Partial<InsertSitePage>): Promise<SitePage>;

  getReviewsByBook(bookId: number): Promise<Review[]>;
  createReview(bookId: number, userId: number | null, userName: string, rating: number, comment?: string): Promise<Review>;
  deleteReview(id: number): Promise<void>;
  getBookRatingSummary(bookId: number): Promise<{ avg: number; count: number }>;
  getAllBookRatings(): Promise<Record<number, { avg: number; count: number }>>;

  getBlogPosts(publishedOnly?: boolean): Promise<BlogPost[]>;
  getBlogPost(id: number): Promise<BlogPost | undefined>;
  createBlogPost(post: InsertBlogPost): Promise<BlogPost>;
  updateBlogPost(id: number, updates: Partial<InsertBlogPost>): Promise<BlogPost>;
  deleteBlogPost(id: number): Promise<void>;
}

export class DatabaseStorage implements IStorage {
  sessionStore: session.Store;

  constructor() {
    pool.query(`
      CREATE TABLE IF NOT EXISTS "session" (
        "sid" varchar NOT NULL COLLATE "default",
        "sess" json NOT NULL,
        "expire" timestamp(6) NOT NULL,
        CONSTRAINT "session_pkey" PRIMARY KEY ("sid")
      );
      CREATE INDEX IF NOT EXISTS "IDX_session_expire" ON "session" ("expire");
    `).catch((err: any) => console.error("Session table creation error:", err));

    this.sessionStore = new PostgresSessionStore({
      pool,
      createTableIfMissing: false,
    });
  }

  async getUser(id: number): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user;
  }

  async getUserByUsername(email: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.email, email));
    return user;
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const [user] = await db.insert(users).values(insertUser).returning();
    return user;
  }

  async getUsers(): Promise<User[]> {
    return db.select().from(users).orderBy(desc(users.createdAt));
  }

  async updateUser(id: number, updates: Partial<User>): Promise<User> {
    const [user] = await db.update(users).set(updates).where(eq(users.id, id)).returning();
    return user;
  }

  async getBooks(category?: string, search?: string): Promise<Book[]> {
    const allBooks = await db.select().from(books).orderBy(desc(books.createdAt));
    return allBooks.filter(book => {
      if (category && book.category !== category) return false;
      if (search) {
        const s = search.toLowerCase();
        return book.titleAr.toLowerCase().includes(s) || book.titleEn.toLowerCase().includes(s) || book.author.toLowerCase().includes(s);
      }
      return true;
    });
  }

  async getBook(id: number): Promise<Book | undefined> {
    const [book] = await db.select().from(books).where(eq(books.id, id));
    return book;
  }

  async createBook(insertBook: InsertBook): Promise<Book> {
    const [book] = await db.insert(books).values(insertBook).returning();
    return book;
  }

  async updateBook(id: number, updates: UpdateBookRequest): Promise<Book> {
    const [book] = await db.update(books).set(updates).where(eq(books.id, id)).returning();
    return book;
  }

  async deleteBook(id: number): Promise<void> {
    await db.delete(books).where(eq(books.id, id));
  }

  async countBooks(): Promise<number> {
    const result = await db.select({ count: sql<number>`count(*)::int` }).from(books);
    return result[0]?.count ?? 0;
  }

  async countLowStockBooks(): Promise<number> {
    const result = await db.select({ count: sql<number>`count(*)::int` }).from(books).where(sql`${books.stock} < 5`);
    return result[0]?.count ?? 0;
  }

  async getCategories(): Promise<Category[]> {
    return db.select().from(categories);
  }

  async getCategory(id: number): Promise<Category | undefined> {
    const [cat] = await db.select().from(categories).where(eq(categories.id, id));
    return cat;
  }

  async createCategory(cat: InsertCategory): Promise<Category> {
    const [created] = await db.insert(categories).values(cat).returning();
    return created;
  }

  async updateCategory(id: number, updates: Partial<InsertCategory>): Promise<Category> {
    const [cat] = await db.update(categories).set(updates).where(eq(categories.id, id)).returning();
    return cat;
  }

  async deleteCategory(id: number): Promise<void> {
    await db.delete(categories).where(eq(categories.id, id));
  }

  async getWilayas(): Promise<Wilaya[]> {
    return db.select().from(wilayas).orderBy(wilayas.code);
  }

  async getActiveWilayas(): Promise<Wilaya[]> {
    return db.select().from(wilayas).where(eq(wilayas.isActive, true)).orderBy(wilayas.code);
  }

  async getWilayaByCode(code: number): Promise<Wilaya | undefined> {
    const [w] = await db.select().from(wilayas).where(eq(wilayas.code, code));
    return w;
  }

  async getWilaya(id: number): Promise<Wilaya | undefined> {
    const [w] = await db.select().from(wilayas).where(eq(wilayas.id, id));
    return w;
  }

  async createWilaya(w: InsertWilaya): Promise<Wilaya> {
    const [created] = await db.insert(wilayas).values(w).returning();
    return created;
  }

  async updateWilaya(id: number, updates: Partial<Wilaya>): Promise<Wilaya> {
    const [updated] = await db.update(wilayas).set(updates).where(eq(wilayas.id, id)).returning();
    return updated;
  }

  async countWilayas(): Promise<number> {
    const result = await db.select({ count: sql<number>`count(*)::int` }).from(wilayas);
    return result[0]?.count ?? 0;
  }

  async createOrder(userId: number | null, customerName: string, phone: string, address: string, city: string, notes: string | undefined, total: number, items: { bookId: number; quantity: number; unitPrice: number }[], wilayaCode?: number, wilayaName?: string, baladiya?: string, shippingPrice?: number): Promise<OrderWithItems> {
    const [order] = await db.insert(orders).values({
      userId, customerName, phone, address, city, notes, total: String(total), status: "pending",
      wilayaCode: wilayaCode || null,
      wilayaName: wilayaName || null,
      baladiya: baladiya || null,
      shippingPrice: shippingPrice != null ? String(shippingPrice) : null,
    }).returning();

    const insertedItems: OrderItem[] = [];
    for (const item of items) {
      const [oi] = await db.insert(orderItems).values({
        orderId: order.id,
        bookId: item.bookId,
        quantity: item.quantity,
        unitPrice: String(item.unitPrice),
      }).returning();
      insertedItems.push(oi);
    }

    return { ...order, items: insertedItems };
  }

  async getOrders(): Promise<OrderWithItems[]> {
    const allOrders = await db.select().from(orders).orderBy(desc(orders.createdAt));
    const result: OrderWithItems[] = [];
    for (const order of allOrders) {
      const items = await db.select().from(orderItems).where(eq(orderItems.orderId, order.id));
      const itemsWithBooks = [];
      for (const item of items) {
        const [book] = await db.select().from(books).where(eq(books.id, item.bookId));
        itemsWithBooks.push({ ...item, book });
      }
      result.push({ ...order, items: itemsWithBooks });
    }
    return result;
  }

  async getOrder(id: number): Promise<OrderWithItems | undefined> {
    const [order] = await db.select().from(orders).where(eq(orders.id, id));
    if (!order) return undefined;
    const items = await db.select().from(orderItems).where(eq(orderItems.orderId, order.id));
    const itemsWithBooks = [];
    for (const item of items) {
      const [book] = await db.select().from(books).where(eq(books.id, item.bookId));
      itemsWithBooks.push({ ...item, book });
    }
    return { ...order, items: itemsWithBooks };
  }

  async getUserOrders(userId: number): Promise<OrderWithItems[]> {
    const allOrders = await db.select().from(orders).where(eq(orders.userId, userId)).orderBy(desc(orders.createdAt));
    const result: OrderWithItems[] = [];
    for (const order of allOrders) {
      const items = await db.select().from(orderItems).where(eq(orderItems.orderId, order.id));
      result.push({ ...order, items });
    }
    return result;
  }

  async updateOrderStatus(id: number, status: string): Promise<Order> {
    const [order] = await db.update(orders).set({ status }).where(eq(orders.id, id)).returning();
    return order;
  }

  async deleteOrder(id: number): Promise<void> {
    await db.delete(orderItems).where(eq(orderItems.orderId, id));
    await db.delete(orders).where(eq(orders.id, id));
  }

  async deleteUser(id: number): Promise<void> {
    await db.delete(users).where(eq(users.id, id));
  }

  async countOrders(): Promise<number> {
    const result = await db.select({ count: sql<number>`count(*)::int` }).from(orders);
    return result[0]?.count ?? 0;
  }

  async totalRevenue(): Promise<number> {
    const result = await db.select({ total: sql<number>`COALESCE(sum(total::numeric), 0)::numeric` }).from(orders).where(sql`${orders.status} != 'cancelled'`);
    return Number(result[0]?.total ?? 0);
  }

  async logActivity(log: InsertActivityLog): Promise<ActivityLog> {
    const [entry] = await db.insert(activityLogs).values(log).returning();
    return entry;
  }

  async getActivityLogs(limit = 100): Promise<ActivityLog[]> {
    return db.select().from(activityLogs).orderBy(desc(activityLogs.createdAt)).limit(limit);
  }

  async getPageBySlug(slug: string): Promise<SitePage | undefined> {
    const [page] = await db.select().from(sitePages).where(eq(sitePages.slug, slug));
    return page;
  }

  async upsertPage(slug: string, data: Partial<InsertSitePage>): Promise<SitePage> {
    const existing = await this.getPageBySlug(slug);
    if (existing) {
      const [updated] = await db.update(sitePages).set({ ...data, updatedAt: new Date() }).where(eq(sitePages.slug, slug)).returning();
      return updated;
    }
    const [created] = await db.insert(sitePages).values({ slug, ...data } as any).returning();
    return created;
  }

  async getReviewsByBook(bookId: number): Promise<Review[]> {
    return db.select().from(reviews).where(and(eq(reviews.bookId, bookId), eq(reviews.approved, true))).orderBy(desc(reviews.createdAt));
  }

  async createReview(bookId: number, userId: number | null, userName: string, rating: number, comment?: string): Promise<Review> {
    const [review] = await db.insert(reviews).values({ bookId, userId, userName, rating, comment: comment || null }).returning();
    return review;
  }

  async deleteReview(id: number): Promise<void> {
    await db.delete(reviews).where(eq(reviews.id, id));
  }

  async getBookRatingSummary(bookId: number): Promise<{ avg: number; count: number }> {
    const result = await db.select({
      avg: sql<number>`COALESCE(AVG(${reviews.rating}), 0)::numeric`,
      count: sql<number>`count(*)::int`,
    }).from(reviews).where(and(eq(reviews.bookId, bookId), eq(reviews.approved, true)));
    return { avg: Number(result[0]?.avg ?? 0), count: result[0]?.count ?? 0 };
  }

  async getAllBookRatings(): Promise<Record<number, { avg: number; count: number }>> {
    const result = await db.select({
      bookId: reviews.bookId,
      avg: sql<number>`COALESCE(AVG(${reviews.rating}), 0)::numeric`,
      count: sql<number>`count(*)::int`,
    }).from(reviews).where(eq(reviews.approved, true)).groupBy(reviews.bookId);

    const map: Record<number, { avg: number; count: number }> = {};
    for (const r of result) {
      map[r.bookId] = { avg: Number(r.avg), count: r.count };
    }
    return map;
  }

  async getBlogPosts(publishedOnly = false): Promise<BlogPost[]> {
    if (publishedOnly) {
      return db.select().from(blogPosts).where(eq(blogPosts.published, true)).orderBy(desc(blogPosts.createdAt));
    }
    return db.select().from(blogPosts).orderBy(desc(blogPosts.createdAt));
  }

  async getBlogPost(id: number): Promise<BlogPost | undefined> {
    const [post] = await db.select().from(blogPosts).where(eq(blogPosts.id, id));
    return post;
  }

  async createBlogPost(post: InsertBlogPost): Promise<BlogPost> {
    const [created] = await db.insert(blogPosts).values(post).returning();
    return created;
  }

  async updateBlogPost(id: number, updates: Partial<InsertBlogPost>): Promise<BlogPost> {
    const [updated] = await db.update(blogPosts).set(updates).where(eq(blogPosts.id, id)).returning();
    return updated;
  }

  async deleteBlogPost(id: number): Promise<void> {
    await db.delete(blogPosts).where(eq(blogPosts.id, id));
  }
}

export const storage = new DatabaseStorage();
