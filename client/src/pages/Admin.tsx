import { useState } from "react";
import { useAuth } from "@/hooks/use-auth";
import { useLocation } from "wouter";
import { useBooks, useCreateBook, useUpdateBook, useDeleteBook } from "@/hooks/use-books";
import { useLanguage } from "@/hooks/use-language";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow
} from "@/components/ui/table";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger,
} from "@/components/ui/dialog";
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent,
  AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue
} from "@/components/ui/select";
import {
  Form, FormControl, FormField, FormItem, FormLabel, FormMessage
} from "@/components/ui/form";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Plus, Pencil, Trash2, Loader2, Image as ImageIcon,
  BookOpen, Package, Users, Activity, BarChart3, Tag, Eye
} from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { insertBookSchema, insertCategorySchema, type InsertBook, type Book, type Category, type InsertCategory } from "@shared/schema";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";

const CATEGORIES_STATIC = ["Fiction", "History", "Science", "Philosophy", "Children", "Religious", "Literature", "Religion"];

export default function Admin() {
  const { user, isLoading: authLoading } = useAuth();
  const [, setLocation] = useLocation();
  const { t } = useLanguage();

  if (authLoading) return <div className="flex h-screen items-center justify-center"><Loader2 className="animate-spin" /></div>;

  if (!user || user.role !== "admin") {
    setLocation("/login");
    return null;
  }

  return (
    <div className="container mx-auto px-4 py-8 min-h-screen">
      <div className="mb-8">
        <h1 className="text-3xl font-bold font-serif text-primary" data-testid="text-admin-title">{t("لوحة التحكم", "Dashboard")}</h1>
        <p className="text-muted-foreground">{t("إدارة المتجر والمحتوى", "Manage store and content")}</p>
      </div>

      <Tabs defaultValue="stats" className="space-y-6">
        <TabsList className="flex-wrap gap-1">
          <TabsTrigger value="stats" className="gap-2" data-testid="tab-stats"><BarChart3 className="w-4 h-4" />{t("إحصائيات", "Stats")}</TabsTrigger>
          <TabsTrigger value="books" className="gap-2" data-testid="tab-books"><BookOpen className="w-4 h-4" />{t("الكتب", "Books")}</TabsTrigger>
          <TabsTrigger value="categories" className="gap-2" data-testid="tab-categories"><Tag className="w-4 h-4" />{t("التصنيفات", "Categories")}</TabsTrigger>
          <TabsTrigger value="orders" className="gap-2" data-testid="tab-orders"><Package className="w-4 h-4" />{t("الطلبات", "Orders")}</TabsTrigger>
          <TabsTrigger value="customers" className="gap-2" data-testid="tab-customers"><Users className="w-4 h-4" />{t("العملاء", "Customers")}</TabsTrigger>
          <TabsTrigger value="activity" className="gap-2" data-testid="tab-activity"><Activity className="w-4 h-4" />{t("السجل", "Activity")}</TabsTrigger>
        </TabsList>

        <TabsContent value="stats"><StatsTab /></TabsContent>
        <TabsContent value="books"><BooksTab /></TabsContent>
        <TabsContent value="categories"><CategoriesTab /></TabsContent>
        <TabsContent value="orders"><OrdersTab /></TabsContent>
        <TabsContent value="customers"><CustomersTab /></TabsContent>
        <TabsContent value="activity"><ActivityTab /></TabsContent>
      </Tabs>
    </div>
  );
}

function StatsTab() {
  const { t } = useLanguage();
  const { data: stats, isLoading } = useQuery<{ totalBooks: number; totalOrders: number; totalCustomers: number; lowStockBooks: number; revenue: number }>({ queryKey: ["/api/admin/stats"] });

  if (isLoading) return <div className="flex justify-center py-12"><Loader2 className="animate-spin" /></div>;

  const statCards = [
    { label: t("إجمالي الكتب", "Total Books"), value: stats?.totalBooks || 0, icon: BookOpen, color: "text-blue-600" },
    { label: t("إجمالي الطلبات", "Total Orders"), value: stats?.totalOrders || 0, icon: Package, color: "text-green-600" },
    { label: t("العملاء", "Customers"), value: stats?.totalCustomers || 0, icon: Users, color: "text-purple-600" },
    { label: t("مخزون منخفض", "Low Stock"), value: stats?.lowStockBooks || 0, icon: BarChart3, color: "text-orange-600" },
  ];

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {statCards.map((s, i) => (
          <Card key={i}>
            <CardContent className="p-6">
              <div className="flex items-center gap-3">
                <div className={`p-2 rounded-md bg-muted ${s.color}`}>
                  <s.icon className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-2xl font-bold" data-testid={`stat-value-${i}`}>{s.value}</p>
                  <p className="text-xs text-muted-foreground">{s.label}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
      <Card>
        <CardContent className="p-6">
          <p className="text-muted-foreground text-sm">{t("الإيرادات الإجمالية", "Total Revenue")}</p>
          <p className="text-3xl font-bold text-primary" data-testid="stat-revenue">
            {Number(stats?.revenue || 0).toLocaleString()} DZD
          </p>
        </CardContent>
      </Card>
    </div>
  );
}

function BooksTab() {
  const { t } = useLanguage();
  const { data: books, isLoading } = useBooks();
  const deleteBook = useDeleteBook();

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-bold">{t("إدارة الكتب", "Manage Books")}</h2>
        <BookDialog mode="create" />
      </div>

      <Card className="overflow-hidden">
        <Table>
          <TableHeader className="bg-muted/50">
            <TableRow>
              <TableHead className="w-[60px]">{t("صورة", "Img")}</TableHead>
              <TableHead>{t("العنوان", "Title")}</TableHead>
              <TableHead className="hidden md:table-cell">{t("المؤلف", "Author")}</TableHead>
              <TableHead>{t("السعر", "Price")}</TableHead>
              <TableHead className="hidden md:table-cell">{t("المخزون", "Stock")}</TableHead>
              <TableHead className="hidden lg:table-cell">{t("التصنيف", "Category")}</TableHead>
              <TableHead className="text-end">{t("إجراءات", "Actions")}</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow><TableCell colSpan={7} className="text-center py-10"><Loader2 className="animate-spin w-8 h-8 mx-auto" /></TableCell></TableRow>
            ) : books?.map((book: Book) => (
              <TableRow key={book.id}>
                <TableCell><img src={book.image} alt="" className="w-10 h-14 object-cover rounded bg-muted" /></TableCell>
                <TableCell className="font-medium">
                  <div className="flex flex-col">
                    <span className="line-clamp-1">{book.titleAr}</span>
                    <span className="text-xs text-muted-foreground line-clamp-1">{book.titleEn}</span>
                  </div>
                </TableCell>
                <TableCell className="hidden md:table-cell">{book.author}</TableCell>
                <TableCell>{Number(book.price).toLocaleString()} DZD</TableCell>
                <TableCell className="hidden md:table-cell">
                  <Badge variant={book.stock < 5 ? "destructive" : "secondary"} className="no-default-hover-elevate no-default-active-elevate">{book.stock}</Badge>
                </TableCell>
                <TableCell className="hidden lg:table-cell">
                  <Badge variant="secondary" className="no-default-hover-elevate no-default-active-elevate">{book.category}</Badge>
                </TableCell>
                <TableCell className="text-end">
                  <div className="flex items-center justify-end gap-1">
                    <BookDialog mode="edit" book={book} />
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button variant="ghost" size="icon" className="text-destructive"><Trash2 className="w-4 h-4" /></Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>{t("تأكيد الحذف", "Confirm Delete")}</AlertDialogTitle>
                          <AlertDialogDescription>{t("هل أنت متأكد من حذف هذا الكتاب؟", "Delete this book? This can't be undone.")}</AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>{t("إلغاء", "Cancel")}</AlertDialogCancel>
                          <AlertDialogAction onClick={() => deleteBook.mutate(book.id)} className="bg-destructive text-destructive-foreground">{t("حذف", "Delete")}</AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Card>
    </div>
  );
}

function BookDialog({ mode, book }: { mode: "create" | "edit"; book?: Book }) {
  const { t } = useLanguage();
  const [open, setOpen] = useState(false);
  const createBook = useCreateBook();
  const updateBook = useUpdateBook();

  const form = useForm<InsertBook>({
    resolver: zodResolver(insertBookSchema),
    defaultValues: book ? {
      titleAr: book.titleAr,
      titleEn: book.titleEn,
      author: book.author,
      descriptionAr: book.descriptionAr,
      descriptionEn: book.descriptionEn,
      price: String(book.price),
      category: book.category,
      image: book.image,
      language: book.language,
      published: book.published,
      isbn: book.isbn || "",
      stock: book.stock,
    } : {
      titleAr: "", titleEn: "", author: "", descriptionAr: "", descriptionEn: "",
      price: "0", category: "", image: "https://images.unsplash.com/photo-1543002588-bfa74002ed7e?w=800&q=80",
      language: "ar", published: true, isbn: "", stock: 0,
    },
  });

  const onSubmit = (data: InsertBook) => {
    if (mode === "create") {
      createBook.mutate(data, { onSuccess: () => { setOpen(false); form.reset(); } });
    } else if (book) {
      updateBook.mutate({ id: book.id, ...data }, { onSuccess: () => setOpen(false) });
    }
  };

  const isPending = createBook.isPending || updateBook.isPending;

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {mode === "create" ? (
          <Button className="gap-2" data-testid="button-add-book"><Plus className="w-4 h-4" />{t("إضافة كتاب", "Add Book")}</Button>
        ) : (
          <Button variant="ghost" size="icon" data-testid={`button-edit-book-${book?.id}`}><Pencil className="w-4 h-4" /></Button>
        )}
      </DialogTrigger>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{mode === "create" ? t("إضافة كتاب جديد", "Add New Book") : t("تعديل الكتاب", "Edit Book")}</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 mt-4">
            <div className="grid md:grid-cols-2 gap-4">
              <div className="space-y-4">
                <h4 className="font-bold text-primary">{t("معلومات عربية", "Arabic Info")}</h4>
                <FormField control={form.control} name="titleAr" render={({ field }) => (<FormItem><FormLabel>{t("العنوان (عربي)", "Title (AR)")}</FormLabel><FormControl><Input {...field} dir="rtl" /></FormControl><FormMessage /></FormItem>)} />
                <FormField control={form.control} name="descriptionAr" render={({ field }) => (<FormItem><FormLabel>{t("الوصف (عربي)", "Description (AR)")}</FormLabel><FormControl><Textarea {...field} dir="rtl" className="min-h-[100px]" /></FormControl><FormMessage /></FormItem>)} />
              </div>
              <div className="space-y-4">
                <h4 className="font-bold text-primary">{t("معلومات إنجليزية", "English Info")}</h4>
                <FormField control={form.control} name="titleEn" render={({ field }) => (<FormItem><FormLabel>{t("العنوان (إنجليزي)", "Title (EN)")}</FormLabel><FormControl><Input {...field} dir="ltr" /></FormControl><FormMessage /></FormItem>)} />
                <FormField control={form.control} name="descriptionEn" render={({ field }) => (<FormItem><FormLabel>{t("الوصف (إنجليزي)", "Description (EN)")}</FormLabel><FormControl><Textarea {...field} dir="ltr" className="min-h-[100px]" /></FormControl><FormMessage /></FormItem>)} />
              </div>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-4 border-t">
              <FormField control={form.control} name="author" render={({ field }) => (<FormItem className="col-span-2"><FormLabel>{t("المؤلف", "Author")}</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>)} />
              <FormField control={form.control} name="price" render={({ field }) => (<FormItem><FormLabel>{t("السعر (DZD)", "Price")}</FormLabel><FormControl><Input type="number" {...field} /></FormControl><FormMessage /></FormItem>)} />
              <FormField control={form.control} name="stock" render={({ field }) => (<FormItem><FormLabel>{t("المخزون", "Stock")}</FormLabel><FormControl><Input type="number" {...field} onChange={e => field.onChange(parseInt(e.target.value) || 0)} /></FormControl><FormMessage /></FormItem>)} />
              <FormField control={form.control} name="category" render={({ field }) => (<FormItem><FormLabel>{t("التصنيف", "Category")}</FormLabel><Select onValueChange={field.onChange} defaultValue={field.value}><FormControl><SelectTrigger><SelectValue placeholder="Select" /></SelectTrigger></FormControl><SelectContent>{CATEGORIES_STATIC.map(c => (<SelectItem key={c} value={c}>{c}</SelectItem>))}</SelectContent></Select><FormMessage /></FormItem>)} />
              <FormField control={form.control} name="language" render={({ field }) => (<FormItem><FormLabel>{t("لغة الكتاب", "Language")}</FormLabel><Select onValueChange={field.onChange} defaultValue={field.value}><FormControl><SelectTrigger><SelectValue /></SelectTrigger></FormControl><SelectContent><SelectItem value="ar">العربية</SelectItem><SelectItem value="en">English</SelectItem><SelectItem value="both">Bilingual</SelectItem></SelectContent></Select><FormMessage /></FormItem>)} />
              <FormField control={form.control} name="isbn" render={({ field }) => (<FormItem><FormLabel>ISBN</FormLabel><FormControl><Input {...field} value={field.value || ""} /></FormControl><FormMessage /></FormItem>)} />
            </div>
            <FormField control={form.control} name="image" render={({ field }) => (<FormItem><FormLabel>{t("رابط الصورة", "Image URL")}</FormLabel><div className="flex gap-2"><FormControl><Input {...field} /></FormControl><div className="w-10 h-10 rounded border bg-muted flex items-center justify-center overflow-hidden shrink-0">{field.value ? <img src={field.value} className="w-full h-full object-cover" /> : <ImageIcon className="w-4 h-4 opacity-50" />}</div></div><FormMessage /></FormItem>)} />
            <Button type="submit" className="w-full" disabled={isPending}>
              {isPending ? <Loader2 className="animate-spin" /> : mode === "create" ? t("إنشاء", "Create") : t("حفظ التغييرات", "Save Changes")}
            </Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}

function CategoriesTab() {
  const { t } = useLanguage();
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const { data: cats, isLoading } = useQuery<Category[]>({ queryKey: ["/api/categories"] });
  const [open, setOpen] = useState(false);
  const [editCat, setEditCat] = useState<Category | null>(null);

  const form = useForm<InsertCategory>({
    resolver: zodResolver(insertCategorySchema),
    defaultValues: { nameAr: "", nameEn: "", slug: "" },
  });

  const createMutation = useMutation({
    mutationFn: async (data: InsertCategory) => {
      const res = await apiRequest("POST", "/api/categories", data);
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/categories"] });
      setOpen(false);
      form.reset();
      toast({ title: t("تم الإنشاء", "Created") });
    },
  });

  const updateMutation = useMutation({
    mutationFn: async ({ id, ...data }: { id: number } & Partial<InsertCategory>) => {
      const res = await apiRequest("PUT", `/api/categories/${id}`, data);
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/categories"] });
      setEditCat(null);
      toast({ title: t("تم التحديث", "Updated") });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: number) => {
      await apiRequest("DELETE", `/api/categories/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/categories"] });
      toast({ title: t("تم الحذف", "Deleted") });
    },
  });

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-bold">{t("إدارة التصنيفات", "Manage Categories")}</h2>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button className="gap-2" data-testid="button-add-category"><Plus className="w-4 h-4" />{t("إضافة تصنيف", "Add Category")}</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader><DialogTitle>{t("تصنيف جديد", "New Category")}</DialogTitle></DialogHeader>
            <Form {...form}>
              <form onSubmit={form.handleSubmit((data) => createMutation.mutate(data))} className="space-y-4 mt-4">
                <FormField control={form.control} name="nameAr" render={({ field }) => (<FormItem><FormLabel>{t("الاسم (عربي)", "Name (AR)")}</FormLabel><FormControl><Input {...field} dir="rtl" /></FormControl><FormMessage /></FormItem>)} />
                <FormField control={form.control} name="nameEn" render={({ field }) => (<FormItem><FormLabel>{t("الاسم (إنجليزي)", "Name (EN)")}</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>)} />
                <FormField control={form.control} name="slug" render={({ field }) => (<FormItem><FormLabel>Slug</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>)} />
                <Button type="submit" className="w-full" disabled={createMutation.isPending}>
                  {createMutation.isPending ? <Loader2 className="animate-spin" /> : t("إنشاء", "Create")}
                </Button>
              </form>
            </Form>
          </DialogContent>
        </Dialog>
      </div>

      <Card className="overflow-hidden">
        <Table>
          <TableHeader className="bg-muted/50">
            <TableRow>
              <TableHead>ID</TableHead>
              <TableHead>{t("الاسم (عربي)", "Name (AR)")}</TableHead>
              <TableHead>{t("الاسم (إنجليزي)", "Name (EN)")}</TableHead>
              <TableHead>Slug</TableHead>
              <TableHead className="text-end">{t("إجراءات", "Actions")}</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow><TableCell colSpan={5} className="text-center py-10"><Loader2 className="animate-spin w-8 h-8 mx-auto" /></TableCell></TableRow>
            ) : cats?.map((cat) => (
              <TableRow key={cat.id}>
                <TableCell>{cat.id}</TableCell>
                <TableCell>{cat.nameAr}</TableCell>
                <TableCell>{cat.nameEn}</TableCell>
                <TableCell><Badge variant="secondary" className="no-default-hover-elevate no-default-active-elevate">{cat.slug}</Badge></TableCell>
                <TableCell className="text-end">
                  <div className="flex justify-end gap-1">
                    <Button variant="ghost" size="icon" onClick={() => setEditCat(cat)}><Pencil className="w-4 h-4" /></Button>
                    <AlertDialog>
                      <AlertDialogTrigger asChild><Button variant="ghost" size="icon" className="text-destructive"><Trash2 className="w-4 h-4" /></Button></AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>{t("حذف التصنيف؟", "Delete category?")}</AlertDialogTitle>
                          <AlertDialogDescription>{t("لا يمكن التراجع عن هذا", "This can't be undone")}</AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>{t("إلغاء", "Cancel")}</AlertDialogCancel>
                          <AlertDialogAction onClick={() => deleteMutation.mutate(cat.id)} className="bg-destructive text-destructive-foreground">{t("حذف", "Delete")}</AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Card>
    </div>
  );
}

function OrdersTab() {
  const { t, language } = useLanguage();
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const { data: orders, isLoading } = useQuery({ queryKey: ["/api/orders"] });

  const updateStatus = useMutation({
    mutationFn: async ({ id, status }: { id: number; status: string }) => {
      const res = await apiRequest("PUT", `/api/orders/${id}/status`, { status });
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/orders"] });
      toast({ title: t("تم التحديث", "Updated") });
    },
  });

  const statusColors: Record<string, string> = {
    pending: "bg-yellow-100 text-yellow-800",
    confirmed: "bg-blue-100 text-blue-800",
    shipped: "bg-purple-100 text-purple-800",
    delivered: "bg-green-100 text-green-800",
    cancelled: "bg-red-100 text-red-800",
  };

  const statusLabels: Record<string, { ar: string; en: string }> = {
    pending: { ar: "قيد الانتظار", en: "Pending" },
    confirmed: { ar: "مؤكد", en: "Confirmed" },
    shipped: { ar: "تم الشحن", en: "Shipped" },
    delivered: { ar: "تم التوصيل", en: "Delivered" },
    cancelled: { ar: "ملغي", en: "Cancelled" },
  };

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-bold">{t("إدارة الطلبات", "Manage Orders")}</h2>
      <Card className="overflow-hidden">
        <Table>
          <TableHeader className="bg-muted/50">
            <TableRow>
              <TableHead>#</TableHead>
              <TableHead>{t("العميل", "Customer")}</TableHead>
              <TableHead>{t("الهاتف", "Phone")}</TableHead>
              <TableHead className="hidden md:table-cell">{t("المدينة", "City")}</TableHead>
              <TableHead>{t("المجموع", "Total")}</TableHead>
              <TableHead>{t("الحالة", "Status")}</TableHead>
              <TableHead className="text-end">{t("تغيير الحالة", "Change")}</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow><TableCell colSpan={7} className="text-center py-10"><Loader2 className="animate-spin w-8 h-8 mx-auto" /></TableCell></TableRow>
            ) : (orders as any[])?.map((order: any) => (
              <TableRow key={order.id}>
                <TableCell className="font-mono text-sm">{order.id}</TableCell>
                <TableCell>
                  <div className="flex flex-col">
                    <span className="font-medium">{order.customerName}</span>
                    <span className="text-xs text-muted-foreground line-clamp-1">{order.address}</span>
                  </div>
                </TableCell>
                <TableCell className="text-sm">{order.phone}</TableCell>
                <TableCell className="hidden md:table-cell">{order.city}</TableCell>
                <TableCell className="font-bold">{Number(order.total).toLocaleString()} DZD</TableCell>
                <TableCell>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${statusColors[order.status] || ""}`}>
                    {language === "ar" ? statusLabels[order.status]?.ar : statusLabels[order.status]?.en || order.status}
                  </span>
                </TableCell>
                <TableCell className="text-end">
                  <Select value={order.status} onValueChange={(status) => updateStatus.mutate({ id: order.id, status })}>
                    <SelectTrigger className="w-[130px]">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {Object.entries(statusLabels).map(([key, labels]) => (
                        <SelectItem key={key} value={key}>{language === "ar" ? labels.ar : labels.en}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </TableCell>
              </TableRow>
            ))}
            {!isLoading && (!orders || (orders as any[]).length === 0) && (
              <TableRow><TableCell colSpan={7} className="text-center py-10 text-muted-foreground">{t("لا توجد طلبات بعد", "No orders yet")}</TableCell></TableRow>
            )}
          </TableBody>
        </Table>
      </Card>
    </div>
  );
}

function CustomersTab() {
  const { t } = useLanguage();
  const { data: customers, isLoading } = useQuery({ queryKey: ["/api/admin/customers"] });

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-bold">{t("إدارة العملاء", "Manage Customers")}</h2>
      <Card className="overflow-hidden">
        <Table>
          <TableHeader className="bg-muted/50">
            <TableRow>
              <TableHead>ID</TableHead>
              <TableHead>{t("الاسم", "Name")}</TableHead>
              <TableHead>{t("البريد", "Email")}</TableHead>
              <TableHead className="hidden md:table-cell">{t("الهاتف", "Phone")}</TableHead>
              <TableHead>{t("الدور", "Role")}</TableHead>
              <TableHead>{t("الحالة", "Status")}</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow><TableCell colSpan={6} className="text-center py-10"><Loader2 className="animate-spin w-8 h-8 mx-auto" /></TableCell></TableRow>
            ) : (customers as any[])?.map((c: any) => (
              <TableRow key={c.id}>
                <TableCell>{c.id}</TableCell>
                <TableCell className="font-medium">{c.name || "-"}</TableCell>
                <TableCell>{c.email}</TableCell>
                <TableCell className="hidden md:table-cell">{c.phone || "-"}</TableCell>
                <TableCell><Badge variant={c.role === "admin" ? "default" : "secondary"} className="no-default-hover-elevate no-default-active-elevate">{c.role}</Badge></TableCell>
                <TableCell><Badge variant={c.enabled ? "secondary" : "destructive"} className="no-default-hover-elevate no-default-active-elevate">{c.enabled ? t("نشط", "Active") : t("معطل", "Disabled")}</Badge></TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Card>
    </div>
  );
}

function ActivityTab() {
  const { t, language } = useLanguage();
  const { data: logs, isLoading } = useQuery({ queryKey: ["/api/admin/activity"] });

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-bold">{t("سجل النشاط", "Activity Log")}</h2>
      <Card className="overflow-hidden">
        <Table>
          <TableHeader className="bg-muted/50">
            <TableRow>
              <TableHead>{t("التاريخ", "Date")}</TableHead>
              <TableHead>{t("المشرف", "Admin")}</TableHead>
              <TableHead>{t("الإجراء", "Action")}</TableHead>
              <TableHead className="hidden md:table-cell">{t("النوع", "Type")}</TableHead>
              <TableHead className="hidden md:table-cell">{t("التفاصيل", "Details")}</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow><TableCell colSpan={5} className="text-center py-10"><Loader2 className="animate-spin w-8 h-8 mx-auto" /></TableCell></TableRow>
            ) : (logs as any[])?.map((log: any) => (
              <TableRow key={log.id}>
                <TableCell className="text-xs text-muted-foreground whitespace-nowrap">
                  {log.createdAt ? new Date(log.createdAt).toLocaleDateString(language === "ar" ? "ar-DZ" : "en-US", { day: "numeric", month: "short", hour: "2-digit", minute: "2-digit" }) : "-"}
                </TableCell>
                <TableCell className="text-sm">{log.adminEmail}</TableCell>
                <TableCell className="font-medium text-sm">{log.action}</TableCell>
                <TableCell className="hidden md:table-cell">
                  {log.entityType && <Badge variant="secondary" className="no-default-hover-elevate no-default-active-elevate">{log.entityType}</Badge>}
                </TableCell>
                <TableCell className="hidden md:table-cell text-sm text-muted-foreground">{log.details || "-"}</TableCell>
              </TableRow>
            ))}
            {!isLoading && (!logs || (logs as any[]).length === 0) && (
              <TableRow><TableCell colSpan={5} className="text-center py-10 text-muted-foreground">{t("لا يوجد سجل نشاط", "No activity logs yet")}</TableCell></TableRow>
            )}
          </TableBody>
        </Table>
      </Card>
    </div>
  );
}
