import { Book } from "@shared/schema";
import { useLanguage } from "@/hooks/use-language";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ShoppingCart } from "lucide-react";
import { Link } from "wouter";

interface BookCardProps {
  book: Book;
}

export function BookCard({ book }: BookCardProps) {
  const { t, language } = useLanguage();

  return (
    <Link href={`/books/${book.id}`}>
      <Card className="group h-full flex flex-col overflow-hidden border-none shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1 cursor-pointer bg-card">
        <div className="relative aspect-[2/3] overflow-hidden bg-muted">
          <img 
            src={book.image} 
            alt={language === "ar" ? book.titleAr : book.titleEn}
            className="object-cover w-full h-full transition-transform duration-500 group-hover:scale-105"
            loading="lazy"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-4">
            <Button className="w-full gap-2 bg-white text-black hover:bg-white/90 transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
              <ShoppingCart className="w-4 h-4" />
              {t("أضف للسلة", "Add to Cart")}
            </Button>
          </div>
        </div>
        
        <CardContent className="p-4 flex-grow">
          <div className="text-xs text-accent font-medium mb-2 uppercase tracking-wider">
            {book.category}
          </div>
          <h3 className="font-serif text-lg font-bold leading-tight mb-2 line-clamp-2 group-hover:text-primary transition-colors">
            {language === "ar" ? book.titleAr : book.titleEn}
          </h3>
          <p className="text-sm text-muted-foreground">
            {book.author}
          </p>
        </CardContent>

        <CardFooter className="p-4 pt-0 flex justify-between items-center border-t border-border/50 mt-auto">
          <span className="font-bold text-lg text-primary">
            {Number(book.price).toLocaleString()} DZD
          </span>
        </CardFooter>
      </Card>
    </Link>
  );
}
