import { Link, useLocation } from "wouter";
import { useLanguage } from "@/hooks/use-language";
import { useAuth } from "@/hooks/use-auth";
import { Button } from "@/components/ui/button";
import { 
  BookOpen, 
  ShoppingBag, 
  LogIn, 
  LogOut, 
  LayoutDashboard,
  Menu,
  X
} from "lucide-react";
import { useState } from "react";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";

export function Navbar() {
  const { t, language, setLanguage } = useLanguage();
  const { user, logout } = useAuth();
  const [location] = useLocation();
  const [isOpen, setIsOpen] = useState(false);

  const toggleLanguage = () => {
    setLanguage(language === "ar" ? "en" : "ar");
  };

  const navLinks = [
    { href: "/", label: t("الرئيسية", "Home") },
    { href: "/store", label: t("المتجر", "Store") },
  ];

  return (
    <nav className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 shadow-sm">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 font-serif text-2xl font-bold text-primary hover:opacity-80 transition-opacity">
          <BookOpen className="h-6 w-6 text-accent" />
          <span>{t("مكتبة الوراق", "Al-Warraq Books")}</span>
        </Link>

        {/* Desktop Nav */}
        <div className="hidden md:flex items-center gap-6">
          {navLinks.map((link) => (
            <Link 
              key={link.href} 
              href={link.href} 
              className={`text-sm font-medium transition-colors hover:text-primary ${
                location === link.href ? "text-primary font-bold" : "text-muted-foreground"
              }`}
            >
              {link.label}
            </Link>
          ))}
        </div>

        {/* Actions */}
        <div className="hidden md:flex items-center gap-3">
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={toggleLanguage}
            className="font-serif px-2"
          >
            {language === "ar" ? "English" : "العربية"}
          </Button>

          {user ? (
            <>
              {user.role === 'admin' && (
                <Link href="/admin">
                  <Button variant="ghost" size="sm" className="gap-2">
                    <LayoutDashboard className="w-4 h-4" />
                    {t("لوحة التحكم", "Dashboard")}
                  </Button>
                </Link>
              )}
              <Button 
                variant="outline" 
                size="sm" 
                onClick={() => logout()}
                className="gap-2"
              >
                <LogOut className="w-4 h-4" />
                {t("خروج", "Logout")}
              </Button>
            </>
          ) : (
            <Link href="/login">
              <Button size="sm" className="gap-2 shadow-sm">
                <LogIn className="w-4 h-4" />
                {t("دخول", "Login")}
              </Button>
            </Link>
          )}

          <Button variant="ghost" size="icon" className="relative">
            <ShoppingBag className="w-5 h-5 text-foreground" />
            <span className="absolute top-1 right-1 w-2 h-2 bg-accent rounded-full animate-pulse" />
          </Button>
        </div>

        {/* Mobile Menu */}
        <div className="md:hidden flex items-center gap-2">
          <Sheet open={isOpen} onOpenChange={setIsOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon">
                <Menu className="w-6 h-6" />
              </Button>
            </SheetTrigger>
            <SheetContent side={language === "ar" ? "right" : "left"}>
              <div className="flex flex-col gap-6 mt-10">
                {navLinks.map((link) => (
                  <Link 
                    key={link.href} 
                    href={link.href} 
                    className="text-lg font-medium hover:text-primary"
                    onClick={() => setIsOpen(false)}
                  >
                    {link.label}
                  </Link>
                ))}
                
                <hr className="my-2" />

                <div className="flex flex-col gap-3">
                   <Button variant="outline" onClick={toggleLanguage}>
                    {language === "ar" ? "English" : "العربية"}
                   </Button>

                   {user ? (
                    <>
                      {user.role === 'admin' && (
                        <Link href="/admin" onClick={() => setIsOpen(false)}>
                          <Button variant="secondary" className="w-full justify-start gap-2">
                             <LayoutDashboard className="w-4 h-4" />
                             {t("لوحة التحكم", "Dashboard")}
                          </Button>
                        </Link>
                      )}
                      <Button variant="destructive" className="w-full justify-start gap-2" onClick={() => logout()}>
                        <LogOut className="w-4 h-4" />
                        {t("خروج", "Logout")}
                      </Button>
                    </>
                   ) : (
                    <Link href="/login" onClick={() => setIsOpen(false)}>
                      <Button className="w-full justify-start gap-2">
                        <LogIn className="w-4 h-4" />
                        {t("تسجيل الدخول", "Login")}
                      </Button>
                    </Link>
                   )}
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </nav>
  );
}
