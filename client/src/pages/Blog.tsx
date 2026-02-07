import { useLanguage } from "@/hooks/use-language";
import { useQuery } from "@tanstack/react-query";
import { Link } from "wouter";
import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent } from "@/components/ui/card";
import { Calendar, Newspaper } from "lucide-react";
import type { BlogPost } from "@shared/schema";

export default function Blog() {
  const { t, language } = useLanguage();
  const { data: posts, isLoading } = useQuery<BlogPost[]>({
    queryKey: ["/api/blog"],
  });

  return (
    <div className="min-h-screen bg-background page-transition">
      <div className="relative bg-primary/10 py-16 md:py-24">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-serif font-bold text-primary" data-testid="text-blog-title">
            {t("المدونة", "Blog")}
          </h1>
          <p className="mt-4 text-muted-foreground text-lg max-w-2xl mx-auto">
            {t("اكتشف أحدث المقالات والأخبار", "Discover the latest articles and news")}
          </p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-12">
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array.from({ length: 6 }).map((_, i) => (
              <Card key={i} className="overflow-hidden">
                <Skeleton className="w-full aspect-video" />
                <CardContent className="p-5 space-y-3">
                  <Skeleton className="h-6 w-3/4" />
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-2/3" />
                  <Skeleton className="h-4 w-1/3" />
                </CardContent>
              </Card>
            ))}
          </div>
        ) : !posts || posts.length === 0 ? (
          <div className="text-center py-20">
            <Newspaper className="w-16 h-16 mx-auto text-muted-foreground/40 mb-4" />
            <h2 className="text-2xl font-serif font-bold text-muted-foreground" data-testid="text-no-posts">
              {t("لا توجد مقالات بعد", "No blog posts yet")}
            </h2>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {posts.map((post) => (
              <Link key={post.id} href={`/blog/${post.id}`}>
                <Card className="group h-full flex flex-col overflow-hidden hover:shadow-xl transition-all duration-300 hover:-translate-y-1 cursor-pointer" data-testid={`card-blog-${post.id}`}>
                  <div className="relative aspect-video overflow-hidden bg-muted">
                    {post.imageUrl ? (
                      <img
                        src={post.imageUrl}
                        alt={language === "ar" ? post.titleAr : post.titleEn}
                        className="object-cover w-full h-full transition-transform duration-500 group-hover:scale-105"
                        loading="lazy"
                      />
                    ) : (
                      <div className="w-full h-full bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center">
                        <Newspaper className="w-12 h-12 text-muted-foreground/40" />
                      </div>
                    )}
                  </div>
                  <CardContent className="p-5 flex-grow flex flex-col">
                    <h2 className="font-serif text-xl font-bold leading-tight mb-2 line-clamp-2 group-hover:text-primary transition-colors" data-testid={`text-blog-title-${post.id}`}>
                      {language === "ar" ? post.titleAr : post.titleEn}
                    </h2>
                    <p className="text-sm text-muted-foreground line-clamp-3 mb-4 flex-grow" data-testid={`text-blog-excerpt-${post.id}`}>
                      {(language === "ar" ? post.contentAr : post.contentEn).substring(0, 150)}
                      {(language === "ar" ? post.contentAr : post.contentEn).length > 150 ? "..." : ""}
                    </p>
                    {post.createdAt && (
                      <div className="flex items-center gap-2 text-xs text-muted-foreground mt-auto">
                        <Calendar className="w-3.5 h-3.5" />
                        <span data-testid={`text-blog-date-${post.id}`}>
                          {new Date(post.createdAt).toLocaleDateString(language === "ar" ? "ar-DZ" : "en-US", { year: 'numeric', month: 'long', day: 'numeric' })}
                        </span>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
