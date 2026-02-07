import { useState } from "react";
import { useRoute, useLocation } from "wouter";
import { useBook } from "@/hooks/use-books";
import { useLanguage } from "@/hooks/use-language";
import { useCart } from "@/hooks/use-cart";
import { useAuth } from "@/hooks/use-auth";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { ShoppingCart, Share2, Heart, ArrowLeft, ArrowRight, Star, Send, Loader2 } from "lucide-react";
import { Link } from "wouter";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import type { Review } from "@shared/schema";

function StarRating({ rating, onRate, interactive = false }: { rating: number; onRate?: (r: number) => void; interactive?: boolean }) {
  const [hover, setHover] = useState(0);
  return (
    <div className="flex gap-0.5">
      {[1, 2, 3, 4, 5].map((star) => (
        <Star
          key={star}
          className={`w-5 h-5 ${interactive ? "cursor-pointer" : ""} ${
            star <= (hover || rating) ? "fill-yellow-400 text-yellow-400" : "text-muted-foreground/30"
          }`}
          onClick={() => interactive && onRate?.(star)}
          onMouseEnter={() => interactive && setHover(star)}
          onMouseLeave={() => interactive && setHover(0)}
          data-testid={`star-${star}`}
        />
      ))}
    </div>
  );
}

function ReviewsSection({ bookId }: { bookId: number }) {
  const { t, language } = useLanguage();
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");

  const { data, isLoading } = useQuery<{ reviews: Review[]; summary: { avg: number; count: number } }>({
    queryKey: ["/api/books", bookId, "reviews"],
    queryFn: async () => {
      const res = await fetch(`/api/books/${bookId}/reviews`, { credentials: "include" });
      if (!res.ok) throw new Error("Failed to fetch reviews");
      return res.json();
    },
  });

  const submitReview = useMutation({
    mutationFn: async () => {
      await apiRequest("POST", `/api/books/${bookId}/reviews`, { rating, comment });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/books", bookId, "reviews"] });
      setRating(0);
      setComment("");
    },
  });

  return (
    <div className="mt-12" data-testid="section-reviews">
      <h2 className="text-2xl font-serif font-bold mb-6" data-testid="text-reviews-title">
        {t("التقييمات والمراجعات", "Reviews & Ratings")}
      </h2>

      {data?.summary && data.summary.count > 0 && (
        <div className="flex items-center gap-4 mb-8 p-4 bg-secondary/20 rounded-md">
          <div className="text-4xl font-bold text-primary" data-testid="text-avg-rating">
            {Number(data.summary.avg).toFixed(1)}
          </div>
          <div>
            <StarRating rating={Math.round(Number(data.summary.avg))} />
            <p className="text-sm text-muted-foreground mt-1" data-testid="text-review-count">
              {data.summary.count} {t("تقييم", "reviews")}
            </p>
          </div>
        </div>
      )}

      {user && (
        <Card className="mb-8">
          <CardContent className="p-6">
            <h3 className="font-semibold mb-4">{t("أضف تقييمك", "Add Your Review")}</h3>
            <div className="mb-4">
              <StarRating rating={rating} onRate={setRating} interactive />
            </div>
            <Textarea
              placeholder={t("اكتب رأيك (اختياري)...", "Write your review (optional)...")}
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              className="mb-4"
              data-testid="input-review-comment"
            />
            <Button
              onClick={() => submitReview.mutate()}
              disabled={rating === 0 || submitReview.isPending}
              className="gap-2"
              data-testid="button-submit-review"
            >
              {submitReview.isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
              {t("إرسال التقييم", "Submit Review")}
            </Button>
          </CardContent>
        </Card>
      )}

      {!user && (
        <Card className="mb-8">
          <CardContent className="p-6 text-center">
            <p className="text-muted-foreground mb-3">{t("سجل دخولك لإضافة تقييم", "Login to add a review")}</p>
            <Link href="/login">
              <Button variant="outline">{t("تسجيل الدخول", "Login")}</Button>
            </Link>
          </CardContent>
        </Card>
      )}

      {isLoading ? (
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <Skeleton key={i} className="h-24 w-full" />
          ))}
        </div>
      ) : data?.reviews && data.reviews.length > 0 ? (
        <div className="space-y-4">
          {data.reviews.map((review) => (
            <Card key={review.id} data-testid={`card-review-${review.id}`}>
              <CardContent className="p-4">
                <div className="flex items-center justify-between gap-2 mb-2 flex-wrap">
                  <div className="flex items-center gap-3">
                    <span className="font-semibold" data-testid={`text-reviewer-${review.id}`}>{review.userName}</span>
                    <StarRating rating={review.rating} />
                  </div>
                  <span className="text-xs text-muted-foreground">
                    {review.createdAt && new Date(review.createdAt).toLocaleDateString(language === "ar" ? "ar-DZ" : "en-US")}
                  </span>
                </div>
                {review.comment && <p className="text-muted-foreground">{review.comment}</p>}
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <p className="text-muted-foreground text-center py-8" data-testid="text-no-reviews">
          {t("لا توجد تقييمات بعد. كن أول من يقيم!", "No reviews yet. Be the first to review!")}
        </p>
      )}
    </div>
  );
}

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

        <ReviewsSection bookId={id} />
      </div>
    </div>
  );
}
