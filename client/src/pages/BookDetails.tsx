import { useRoute, useLocation } from "wouter";
import { useBook } from "@/hooks/use-books";
import { useLanguage } from "@/hooks/use-language";
import { useCart } from "@/hooks/use-cart";
import { useAuth } from "@/hooks/use-auth";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { ShoppingCart, Share2, Heart, ArrowLeft, ArrowRight, Award, Loader2 } from "lucide-react";
import { Link } from "wouter";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { useState } from "react";
import { api } from "@shared/routes";

export default function BookDetails() {
  const [, params] = useRoute("/books/:id");
  const id = parseInt(params?.id || "0");
  const { data: book, isLoading } = useBook(id);
  const { t, language, dir } = useLanguage();
  const { addToCart } = useCart();
  const { user } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [, navigate] = useLocation();
  const [showRedeemConfirm, setShowRedeemConfirm] = useState(false);

  const redeemMutation = useMutation({
    mutationFn: async () => {
      const res = await apiRequest("POST", "/api/points/redeem", { bookId: id, quantity: 1 });
      return res.json();
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: [api.auth.me.path] });
      queryClient.invalidateQueries({ queryKey: ["/api/books", id] });
      toast({
        title: t("تم الاسترداد بنجاح!", "Redeemed Successfully!"),
        description: t(
          `تم خصم ${data.pointsUsed} نقطة. رصيدك المتبقي: ${data.remainingPoints} نقطة`,
          `${data.pointsUsed} points deducted. Remaining: ${data.remainingPoints} points`
        ),
      });
      setShowRedeemConfirm(false);
    },
    onError: (error: any) => {
      toast({
        title: t("فشل الاسترداد", "Redemption Failed"),
        description: error.message,
        variant: "destructive",
      });
      setShowRedeemConfirm(false);
    },
  });

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

  const userPoints = (user as any)?.points || 0;
  const canRedeem = book.pointsPrice && book.pointsPrice > 0 && user && userPoints >= book.pointsPrice;

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
                {book.pointsPrice && book.pointsPrice > 0 && (
                  <Badge variant="secondary" className="gap-1 no-default-hover-elevate no-default-active-elevate">
                    <Award className="w-3 h-3 text-yellow-500" />
                    {book.pointsPrice} {t("نقطة", "pts")}
                  </Badge>
                )}
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

              {book.pointsPrice && book.pointsPrice > 0 && (
                <div className="bg-yellow-50 dark:bg-yellow-900/10 border border-yellow-200 dark:border-yellow-800 rounded-md p-4 mb-6" data-testid="card-points-redeem">
                  <div className="flex items-center gap-3">
                    <Award className="w-6 h-6 text-yellow-600 shrink-0" />
                    <div className="flex-1">
                      <p className="font-bold text-sm">
                        {t("احصل عليه مجانا بالنقاط!", "Get it free with points!")}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {t(
                          `يتطلب ${book.pointsPrice} نقطة`,
                          `Requires ${book.pointsPrice} points`
                        )}
                        {user && (
                          <span> — {t(`رصيدك: ${userPoints} نقطة`, `Your balance: ${userPoints} pts`)}</span>
                        )}
                      </p>
                    </div>
                    {!user ? (
                      <Button variant="outline" size="sm" onClick={() => navigate("/login")} data-testid="button-login-to-redeem">
                        {t("سجل دخول", "Login")}
                      </Button>
                    ) : !showRedeemConfirm ? (
                      <Button
                        variant="outline"
                        size="sm"
                        disabled={!canRedeem}
                        onClick={() => setShowRedeemConfirm(true)}
                        className="gap-1"
                        data-testid="button-redeem-points"
                      >
                        <Award className="w-4 h-4" />
                        {canRedeem
                          ? t("استبدل بالنقاط", "Redeem")
                          : t("نقاط غير كافية", "Not enough pts")}
                      </Button>
                    ) : (
                      <div className="flex gap-2">
                        <Button
                          variant="default"
                          size="sm"
                          disabled={redeemMutation.isPending}
                          onClick={() => redeemMutation.mutate()}
                          data-testid="button-confirm-redeem"
                        >
                          {redeemMutation.isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : t("تأكيد", "Confirm")}
                        </Button>
                        <Button variant="ghost" size="sm" onClick={() => setShowRedeemConfirm(false)} data-testid="button-cancel-redeem">
                          {t("إلغاء", "Cancel")}
                        </Button>
                      </div>
                    )}
                  </div>
                </div>
              )}

              <div className="flex flex-col sm:flex-row gap-4 pt-8 border-t">
                <Button size="lg" className="flex-1 gap-2 text-lg" onClick={() => addToCart(book)} data-testid="button-add-to-cart">
                  <ShoppingCart className="w-5 h-5" />
                  {t("أضف إلى السلة", "Add to Cart")}
                </Button>
                <div className="flex gap-4">
                  <Button size="icon" variant="outline">
                    <Heart className="w-5 h-5" />
                  </Button>
                  <Button size="icon" variant="outline">
                    <Share2 className="w-5 h-5" />
                  </Button>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 mt-12 text-sm text-muted-foreground">
                <div>
                  <span className="font-bold block mb-1">{t("الرقم المعياري:", "ISBN:")}</span>
                  {book.isbn || "-"}
                </div>
                <div>
                  <span className="font-bold block mb-1">{t("اللغة:", "Language:")}</span>
                  {book.language === "ar" ? "العربية" : book.language === "en" ? "English" : "Bilingual"}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
