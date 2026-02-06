import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useAuth } from "@/hooks/use-auth";
import { useLanguage } from "@/hooks/use-language";
import { useLocation, Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { BookOpen, Lock } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";

// Zod schema for login
const loginSchema = z.object({
  username: z.string().min(1, "Email/Username is required"),
  password: z.string().min(1, "Password is required"),
});

export default function Login() {
  const { login, isLoggingIn, user } = useAuth();
  const { t } = useLanguage();
  const [, setLocation] = useLocation();

  // Redirect if already logged in
  if (user) {
    setLocation("/");
    return null;
  }

  const form = useForm<z.infer<typeof loginSchema>>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      username: "",
      password: "",
    },
  });

  const onSubmit = (data: z.infer<typeof loginSchema>) => {
    login(data, {
      onSuccess: (data: any) => setLocation(data?.role === "admin" ? "/admin" : "/"),
    });
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-secondary/30 p-4">
      <Card className="w-full max-w-md shadow-xl border-t-4 border-t-primary">
        <CardHeader className="text-center space-y-2">
          <div className="mx-auto w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mb-4 text-primary">
            <Lock className="w-6 h-6" />
          </div>
          <CardTitle className="text-2xl font-serif font-bold text-primary">
            {t("تسجيل الدخول", "Admin Login")}
          </CardTitle>
          <CardDescription>
            {t("أدخل بياناتك للوصول إلى لوحة التحكم", "Enter your credentials to access the dashboard")}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="username"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t("البريد الإلكتروني", "Email Address")}</FormLabel>
                    <FormControl>
                      <Input placeholder="admin@example.com" {...field} className="h-11" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t("كلمة المرور", "Password")}</FormLabel>
                    <FormControl>
                      <Input type="password" placeholder="••••••••" {...field} className="h-11" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit" className="w-full h-11 text-lg font-medium" disabled={isLoggingIn}>
                {isLoggingIn ? t("جاري الدخول...", "Logging in...") : t("دخول", "Login")}
              </Button>
            </form>
          </Form>
        </CardContent>
        <CardFooter className="justify-center border-t p-4 bg-muted/20 flex-col gap-2">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <BookOpen className="w-4 h-4" />
            <span>{t("دار علي بن زيد للطباعة والنشر", "Dar Ali BenZid Publishing")}</span>
          </div>
          <Link href="/signup" className="text-sm text-primary font-medium">
            {t("إنشاء حساب جديد", "Create new account")}
          </Link>
        </CardFooter>
      </Card>
    </div>
  );
}
