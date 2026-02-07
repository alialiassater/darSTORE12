import { useRoute, useLocation } from "wouter";
import { useBook } from "@/hooks/use-books";
import { useLanguage } from "@/hooks/use-language";
import { useCart } from "@/hooks/use-cart";
import { useAuth } from "@/hooks/use-auth";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { ShoppingCart, Share2, Heart, ArrowLeft, ArrowRight } from "lucide-react";
import { Link } from "wouter";

export default function BookDetails() {
  const [, params] = useRoute("/books/:id");
  const id = parseInt(params?.id || "0");
  const { data: book, isLoading } = useBook(id);
  const { t, language, dir } = useLanguage();
  const { addToCart } = useCart();
  const { user } = useAuth();
  const [, navigate] = useLocation();

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-12">
        <div className="grid md:grid-cols-2 gap-8">
          <Skeleton className="w-full aspect-[2/3] rounded-lg" />
          <div className="space-y-4">
            <Skeleton className="h-10 w-3/4" />
            <Skeleton className="h-6 w-1/2" />
            <Skeleton className="h-32 w-full" />
          </div>
        </div>
      </div>
    );
  }

  if (!book) {
    return (
      <div className="container mx-auto px-4 py-20 text-center">
        <h2 className="text-2xl font-bold mb-4">{t("الكتاب غير موجود", "Book Not Found")}</h2>
        <Link href="/store">
          <Button>{t("العودة للمتجر", "Return to Store")}</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background py-12 page-transition">
      <div className="container mx-auto px-4">
        <div className="mb-6">
          <Link href="/store">
            <Button variant="ghost" className="gap-2 px-0">
              {dir === "rtl" ? <ArrowRight className="w-4 h-4" /> : <ArrowLeft className="w-4 h-4" />}
              {t("العودة للقائمة", "Back to list")}
            </Button>
          </Link>
        </div>

        <div className="bg-card rounded-md shadow-sm border overflow-hidden">
          <div className="grid md:grid-cols-12 gap-0">
            <div className="md:col-span-5 lg:col-span-4 bg-secondary/20 p-8 flex items-center justify-center border-b md:border-b-0 md:border-e">
              <div className="relative w-full max-w-sm shadow-2xl rounded-sm overflow-hidden">
                <img
                  src={book.image}
                  alt={language === "ar" ? book.titleAr : book.titleEn}
                  className="w-full h-auto object-cover"
                  data-testid="img-book-cover"
                />
              </div>
            </div>

            <div className="md:col-span-7 lg:col-span-8 p-8 md:p-12 flex flex-col justify-center">
              <div className="mb-2 flex items-center gap-2 flex-wrap">
                <span className="bg-accent/10 text-accent px-3 py-1 rounded-full text-sm font-semibold tracking-wide">
                  {book.category}
                </span>
              </div>

              <h1 className="text-3xl md:text-5xl font-serif font-bold text-primary mb-4 leading-tight" data-testid="text-book-title">
                {language === "ar" ? book.titleAr : book.titleEn}
              </h1>

              <p className="text-xl text-muted-foreground mb-6 font-medium">
                {t("تأليف:", "By:")} <span className="text-foreground" data-testid="text-book-author">{book.author}</span>
              </p>

              <div className="text-3xl font-bold text-primary mb-8" data-testid="text-book-price">
                {Number(book.price).toLocaleString()} DZD
              </div>

              <div className="prose prose-lg dark:prose-invert max-w-none mb-10 text-muted-foreground leading-relaxed">
                <p>{language === "ar" ? book.descriptionAr : book.descriptionEn}</p>
              </div>

              <div className="flex flex-col sm:flex-row gap-4 pt-8 border-t">
                <Button size="lg" className="flex-1 gap-2 text-lg" onClick={() => addToCart(book)} data-testid="button-add-to-cart">
                  <ShoppingCart className="w-5 h-5" />
                  {t("أضف إلى السلة", "Add to Cart")}
                </Button>
                <div className="flex gap-4">
                  <Button variant="outline" size="lg" data-testid="button-share">
                    <Share2 className="w-5 h-5" />
                  </Button>
                  <Button variant="outline" size="lg" data-testid="button-wishlist">
                    <Heart className="w-5 h-5" />
                  </Button>
                </div>
              </div>

              <div className="mt-10 grid grid-cols-2 gap-4 text-sm">
                {book.isbn && (
                  <div>
                    <span className="text-muted-foreground">{t("الرقم المعياري:", "ISBN:")}</span>{" "}
                    <span className="font-medium" data-testid="text-book-isbn">{book.isbn}</span>
                  </div>
                )}
                <div>
                  <span className="text-muted-foreground">{t("اللغة:", "Language:")}</span>{" "}
                  <span className="font-medium" data-testid="text-book-language">
                    {book.language === "ar" ? t("العربية", "Arabic") : book.language === "en" ? t("الإنجليزية", "English") : t("ثنائي اللغة", "Bilingual")}
                  </span>
                </div>
                <div>
                  <span className="text-muted-foreground">{t("المخزون:", "Stock:")}</span>{" "}
                  <span className={`font-medium ${book.stock > 0 ? "text-green-600" : "text-destructive"}`} data-testid="text-book-stock">
                    {book.stock > 0 ? t("متوفر", "Available") : t("نفذ المخزون", "Out of stock")}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
