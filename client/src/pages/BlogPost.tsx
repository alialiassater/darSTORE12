import { useRoute } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { useLanguage } from "@/hooks/use-language";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { Calendar, ArrowLeft, ArrowRight, BookOpen } from "lucide-react";
import { Link } from "wouter";
import type { BlogPost } from "@shared/schema";

export default function BlogPostPage() {
  const [, params] = useRoute("/blog/:id");
  const id = params?.id;
  const { t, language, dir } = useLanguage();

  const { data: post, isLoading } = useQuery<BlogPost>({
    queryKey: ["/api/blog", id],
    queryFn: async () => {
      const res = await fetch(`/api/blog/${id}`, { credentials: "include" });
      if (!res.ok) throw new Error("Failed to fetch post");
      return res.json();
    },
    enabled: !!id,
  });

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <div className="container mx-auto px-4 py-12 max-w-4xl">
          <Skeleton className="h-8 w-32 mb-8" />
          <Skeleton className="w-full aspect-video rounded-md mb-8" />
          <Skeleton className="h-10 w-3/4 mb-4" />
          <Skeleton className="h-5 w-48 mb-8" />
          <div className="space-y-3">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-5/6" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-4/5" />
          </div>
        </div>
      </div>
    );
  }

  if (!post) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <BookOpen className="w-16 h-16 mx-auto text-muted-foreground/40 mb-4" />
          <h2 className="text-2xl font-serif font-bold mb-4" data-testid="text-post-not-found">
            {t("المقال غير موجود", "Post not found")}
          </h2>
          <Link href="/blog">
            <Button data-testid="button-back-to-blog">
              {t("العودة للمدونة", "Back to Blog")}
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background page-transition">
      <div className="container mx-auto px-4 py-12 max-w-4xl">
        <div className="mb-8">
          <Link href="/blog">
            <Button variant="ghost" className="gap-2 px-0" data-testid="button-back-to-blog">
              {dir === "rtl" ? <ArrowRight className="w-4 h-4" /> : <ArrowLeft className="w-4 h-4" />}
              {t("العودة للمدونة", "Back to Blog")}
            </Button>
          </Link>
        </div>

        {post.imageUrl && (
          <div className="w-full aspect-video rounded-md overflow-hidden mb-8">
            <img
              src={post.imageUrl}
              alt={language === "ar" ? post.titleAr : post.titleEn}
              className="w-full h-full object-cover"
              data-testid="img-blog-post"
            />
          </div>
        )}

        <h1 className="text-3xl md:text-4xl font-serif font-bold text-primary mb-4" data-testid="text-post-title">
          {language === "ar" ? post.titleAr : post.titleEn}
        </h1>

        {post.createdAt && (
          <div className="flex items-center gap-2 text-muted-foreground mb-8">
            <Calendar className="w-4 h-4" />
            <span data-testid="text-post-date">
              {new Date(post.createdAt).toLocaleDateString(language === "ar" ? "ar-DZ" : "en-US", { year: 'numeric', month: 'long', day: 'numeric' })}
            </span>
          </div>
        )}

        <div className="prose prose-lg dark:prose-invert max-w-none leading-relaxed text-foreground" data-testid="text-post-content">
          {(language === "ar" ? post.contentAr : post.contentEn).split("\n").map((paragraph, i) => (
            <p key={i}>{paragraph}</p>
          ))}
        </div>
      </div>
    </div>
  );
}
