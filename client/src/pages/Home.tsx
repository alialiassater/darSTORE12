import { useLanguage } from "@/hooks/use-language";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import { useBooks } from "@/hooks/use-books";
import { BookCard } from "@/components/ui/book-card";
import {
  BookOpen,
  Star,
  Sparkles,
  TrendingUp,
  Pencil,
  Loader2,
  Save,
} from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { apiUrl, apiRequest } from "@/lib/queryClient";
import { useAuth } from "@/hooks/use-auth";
import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useToast } from "@/hooks/use-toast";

const homeSchema = z.object({
  heroTitleAr: z.string().min(1),
  heroTitleEn: z.string().min(1),
  heroDescAr: z.string().min(1),
  heroDescEn: z.string().min(1),
});

type HomeData = z.infer<typeof homeSchema>;

export default function Home() {
  const { t, language, dir } = useLanguage();
  const { data: books, isLoading } = useBooks();
  const { user } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [isEditing, setIsEditing] = useState(false);

  const { data: page } = useQuery<any>({
    queryKey: ["/api/pages/home"],
    queryFn: async () => {
      const res = await fetch("/api/pages/home");
      if (!res.ok) return null;
      return res.json();
    },
  });

  const updateMutation = useMutation({
    mutationFn: async (data: HomeData) => {
      await apiRequest("PUT", "/api/admin/pages/home", {
        slug: "home",
        titleAr: data.heroTitleAr,
        titleEn: data.heroTitleEn,
        contentAr: data.heroDescAr,
        contentEn: data.heroDescEn,
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/pages/home"] });
      setIsEditing(false);
      toast({ title: t("تم التحديث بنجاح", "Updated successfully") });
    },
  });

  const form = useForm<HomeData>({
    resolver: zodResolver(homeSchema),
    values: {
      heroTitleAr: page?.titleAr || "دار علي بن زيد للطباعة والنشر",
      heroTitleEn: page?.titleEn || "Dar Ali Benzid for Printing & Publishing",
      heroDescAr:
        page?.contentAr ||
        "دار علي بن زيد للطباعة والنشر تقدم لكم نخبة من أفضل الكتب العربية والعالمية. تصفحوا اصداراتنا .",
      heroDescEn:
        page?.contentEn ||
        "Dar Ali BenZid for Printing & Publishing offers you a selection of the best Arabic and international books. Browse our carefully curated collection.",
    },
  });

  const isAdmin = user && (user.role === "admin" || user.role === "employee");
  const featuredBooks = books?.slice(0, 4);

  return (
    <div className="flex flex-col min-h-screen page-transition">
      {/* Hero Section */}
      <section className="relative min-h-[600px] flex items-center justify-center overflow-hidden bg-primary">
        {/* Admin Edit Trigger */}
        {isAdmin && (
          <Dialog open={isEditing} onOpenChange={setIsEditing}>
            <DialogTrigger asChild>
              <Button
                size="icon"
                variant="default"
                className="fixed bottom-24 end-6 z-50 shadow-lg rounded-full"
                data-testid="button-edit-home"
              >
                <Pencil className="w-5 h-5" />
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>
                  {t("تعديل القسم الرئيسي", "Edit Hero Section")}
                </DialogTitle>
              </DialogHeader>
              <Form {...form}>
                <form
                  onSubmit={form.handleSubmit((data) =>
                    updateMutation.mutate(data),
                  )}
                  className="space-y-4"
                >
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="heroTitleAr"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>
                            {t("العنوان (عربي)", "Title (AR)")}
                          </FormLabel>
                          <FormControl>
                            <Input {...field} dir="rtl" />
                          </FormControl>
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="heroTitleEn"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>
                            {t("العنوان (إنجليزي)", "Title (EN)")}
                          </FormLabel>
                          <FormControl>
                            <Input {...field} dir="ltr" />
                          </FormControl>
                        </FormItem>
                      )}
                    />
                  </div>
                  <FormField
                    control={form.control}
                    name="heroDescAr"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>
                          {t("الوصف (عربي)", "Description (AR)")}
                        </FormLabel>
                        <FormControl>
                          <Textarea {...field} dir="rtl" />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="heroDescEn"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>
                          {t("الوصف (إنجليزي)", "Description (EN)")}
                        </FormLabel>
                        <FormControl>
                          <Textarea {...field} dir="ltr" />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                  <Button
                    type="submit"
                    className="w-full"
                    disabled={updateMutation.isPending}
                  >
                    {updateMutation.isPending ? (
                      <Loader2 className="animate-spin" />
                    ) : (
                      <>
                        <Save className="w-4 h-4 me-2" />
                        {t("حفظ", "Save")}
                      </>
                    )}
                  </Button>
                </form>
              </Form>
            </DialogContent>
          </Dialog>
        )}

        {/* Background Image / Pattern with Dark Overlay */}
        <div className="absolute inset-0 z-0">
          <img
            src={apiUrl("/books-bg.jpg")}
            alt="Library background"
            className="absolute inset-0 w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/80 via-black/60 to-primary/90 z-10" />
          <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] z-20" />

          {/* Abstract blobs for some depth - more subtle */}
          <div className="absolute -top-24 -right-24 w-96 h-96 bg-primary/20 rounded-full blur-3xl animate-pulse z-20"></div>
          <div className="absolute top-1/2 left-0 w-64 h-64 bg-white/5 rounded-full blur-3xl z-20"></div>
        </div>

        <div className="container mx-auto px-4 relative z-20 text-center max-w-4xl py-20 md:py-32">
          <h1 className="text-4xl md:text-6xl font-serif font-bold mb-6 leading-tight text-white drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]">
            {page
              ? language === "ar"
                ? page.titleAr
                : page.titleEn
              : t(
                  "دار علي بن زيد للطباعة والنشر",
                  "Dar Ali Benzid for Printing & Publishing",
                )}
          </h1>
          <p className="text-lg md:text-xl text-white/90 mb-10 max-w-2xl mx-auto leading-relaxed drop-shadow-sm font-medium">
            {page
              ? language === "ar"
                ? page.contentAr
                : page.contentEn
              : t(
                  "دار علي بن زيد للطباعة والنشر تقدم لك نخبة من أفضل الكتب العربية والعالمية. تصفح اصداراتنا .",
                  "Dar Ali BenZid for Printing & Publishing offers you a selection of the best Arabic and international books. Browse our carefully curated collection.",
                )}
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/store">
              <Button
                size="lg"
                className="bg-accent text-accent-foreground hover-elevate active-elevate-2 shadow-xl text-lg px-8"
              >
                {t("تصفح الكتب", "Browse Books")}
              </Button>
            </Link>
            <Link href="/store?category=new">
              <Button
                size="lg"
                variant="outline"
                className="border-white/40 text-white hover:bg-white/10 backdrop-blur-sm text-lg px-8"
              >
                {t("الإصدارات الجديدة", "New Releases")}
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-background">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-card p-6 rounded-xl border shadow-sm flex flex-col items-center text-center animate-fade-in-up stagger-1 hover-elevate">
              <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center text-primary mb-4">
                <BookOpen className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold mb-2">
                {t("مجموعة متنوعة", "Diverse Collection")}
              </h3>
              <p className="text-muted-foreground">
                {t(
                  "آلاف الكتب في شتى المجالات",
                  "Thousands of books in various fields",
                )}
              </p>
            </div>
            <div className="bg-card p-6 rounded-xl border shadow-sm flex flex-col items-center text-center animate-fade-in-up stagger-2 hover-elevate">
              <div className="w-12 h-12 bg-accent/10 rounded-full flex items-center justify-center text-accent mb-4">
                <Star className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold mb-2">
                {t("جودة عالية", "High Quality")}
              </h3>
              <p className="text-muted-foreground">
                {t("كتب وطبعات فاخرة", "Premium books and editions")}
              </p>
            </div>
            <div className="bg-card p-6 rounded-xl border shadow-sm flex flex-col items-center text-center animate-fade-in-up stagger-3 hover-elevate">
              <div className="w-12 h-12 bg-green-500/10 rounded-full flex items-center justify-center text-green-600 mb-4">
                <Sparkles className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold mb-2">
                {t("شحن سريع", "Fast Shipping")}
              </h3>
              <p className="text-muted-foreground">
                {t("توصيل لكافة الولايات", "Delivery to all states")}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Books Section */}
      <section className="py-16 bg-secondary/30">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-end mb-10">
            <div>
              <h2 className="text-3xl font-serif font-bold text-primary mb-2 flex items-center gap-2">
                <TrendingUp className="w-6 h-6 text-accent" />
                {t("كتب مختارة", "Featured Books")}
              </h2>
              <p className="text-muted-foreground">
                {t(
                  "أحدث الإضافات إلى دار النشر",
                  "Latest additions to our library",
                )}
              </p>
            </div>
            <Link href="/store">
              <Button variant="outline" className="text-accent font-bold">
                {t("عرض الكل", "View All")} &rarr;
              </Button>
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {isLoading
              ? Array.from({ length: 4 }).map((_, i) => (
                  <div key={i} className="flex flex-col gap-4">
                    <Skeleton className="w-full aspect-[2/3] rounded-lg" />
                    <Skeleton className="h-6 w-3/4" />
                    <Skeleton className="h-4 w-1/2" />
                  </div>
                ))
              : featuredBooks?.map((book: any) => (
                  <BookCard key={book.id} book={book} />
                ))}
          </div>
        </div>
      </section>

      {/* About Section Shortcut */}
      <section className="py-16 bg-background border-y">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="relative group">
              <div className="aspect-video rounded-2xl overflow-hidden shadow-2xl">
                <img
                  src={apiUrl("/about-hero.jpg")}
                  alt="About Dar Ali BenZid"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="absolute -bottom-6 -right-6 w-48 h-48 bg-accent/10 rounded-full blur-3xl -z-10"></div>
            </div>
            <div className="space-y-6">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-sm font-bold">
                <BookOpen className="w-4 h-4" />
                {t("من نحن", "About Us")}
              </div>
              <h2 className="text-3xl md:text-4xl font-serif font-bold text-primary">
                {t("قصة دار علي بن زيد", "The Story of Dar Ali BenZid")}
              </h2>
              <p className="text-lg text-muted-foreground leading-relaxed line-clamp-4">
                {language === "ar"
                  ? "دار علي بن زيد للطباعة والنشر هي دار جزائرية متخصصة في طباعة ونشر الكتب المتميزة بمختلف المجالات. نسعى دائماً لتقديم محتوى هادف وجوة طباعة عالية الجودة."
                  : "Dar Ali BenZid for Printing & Publishing is an Algerian house specializing in printing and publishing distinguished books in various fields. We always strive to provide meaningful content and high-quality printing."}
              </p>
              <div className="flex gap-4">
                <Link href="/about">
                  <Button size="lg" className="hover-elevate">
                    {t("اقرأ القصة كاملة", "Read Full Story")}
                  </Button>
                </Link>
                {isAdmin && (
                  <Link href="/about">
                    <Button size="lg" variant="outline" className="gap-2">
                      <Pencil className="w-4 h-4" />
                      {t("تعديل", "Edit")}
                    </Button>
                  </Link>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Newsletter / CTA */}
      <section className="py-20 container mx-auto px-4">
        <div className="bg-primary rounded-3xl p-8 md:p-12 text-center relative overflow-hidden">
          <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10"></div>
          <div className="relative z-10 max-w-2xl mx-auto">
            <h2 className="text-3xl font-serif font-bold text-white mb-4">
              {t("انضم إلى مجتمع القراء", "Join Our Community of Readers")}
            </h2>
            <p className="text-primary-foreground/80 mb-8">
              {t(
                "اشترك في نشرتنا البريدية للحصول على آخر الأخبار والعروض الحصرية.",
                "Subscribe to our newsletter for the latest news and exclusive offers.",
              )}
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <input
                type="email"
                placeholder={t("بريدك الإلكتروني", "Your email address")}
                className="px-6 py-3 rounded-lg bg-white/10 border border-white/20 text-white placeholder:text-white/50 focus:outline-none focus:bg-white/20 w-full sm:w-auto min-w-[300px]"
              />
              <Button
                size="lg"
                className="bg-accent text-accent-foreground hover:bg-accent/90"
              >
                {t("اشترك", "Subscribe")}
              </Button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
