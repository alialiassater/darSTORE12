import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { registerUserSchema } from "@shared/schema";
import { z } from "zod";
import { useAuth } from "@/hooks/use-auth";
import { useLanguage } from "@/hooks/use-language";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { UserPlus, BookOpen, Loader2 } from "lucide-react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import { api } from "@shared/routes";
import { Link } from "wouter";

export default function Signup() {
  const { user } = useAuth();
  const { t } = useLanguage();
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  if (user) {
    setLocation("/");
    return null;
  }

  const form = useForm<z.infer<typeof registerUserSchema>>({
    resolver: zodResolver(registerUserSchema),
    defaultValues: {
      email: "",
      password: "",
      name: "",
      phone: "",
    },
  });

  const registerMutation = useMutation({
    mutationFn: async (data: z.infer<typeof registerUserSchema>) => {
      const res = await fetch(api.auth.register.path, {
        method: api.auth.register.method,
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(data),
      });
      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.message || "Registration failed");
      }
      return res.json();
    },
    onSuccess: (data) => {
      queryClient.setQueryData([api.auth.me.path], data);
      toast({ title: t("مرحباً!", "Welcome!"), description: t("تم إنشاء حسابك بنجاح", "Account created successfully") });
      setLocation("/");
    },
    onError: (err) => {
      toast({ title: t("خطأ", "Error"), description: err.message, variant: "destructive" });
    },
  });

  return (
    <div className="min-h-screen flex items-center justify-center bg-secondary/30 p-4 page-transition">
      <Card className="w-full max-w-md shadow-xl border-t-4 border-t-primary">
        <CardHeader className="text-center space-y-2">
          <div className="mx-auto w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mb-4 text-primary">
            <UserPlus className="w-6 h-6" />
          </div>
          <CardTitle className="text-2xl font-serif font-bold text-primary">
            {t("إنشاء حساب", "Create Account")}
          </CardTitle>
          <CardDescription>
            {t("أنشئ حساباً جديداً للتسوق والمتابعة", "Create a new account to shop and track orders")}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit((data) => registerMutation.mutate(data))} className="space-y-4">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t("الاسم", "Name")}</FormLabel>
                    <FormControl><Input {...field} data-testid="input-signup-name" /></FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t("البريد الإلكتروني", "Email")}</FormLabel>
                    <FormControl><Input type="email" {...field} data-testid="input-signup-email" /></FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="phone"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t("رقم الهاتف (اختياري)", "Phone (optional)")}</FormLabel>
                    <FormControl><Input type="tel" {...field} data-testid="input-signup-phone" /></FormControl>
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
                    <FormControl><Input type="password" {...field} data-testid="input-signup-password" /></FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit" className="w-full" disabled={registerMutation.isPending} data-testid="button-signup-submit">
                {registerMutation.isPending ? <Loader2 className="animate-spin" /> : t("إنشاء الحساب", "Sign Up")}
              </Button>
            </form>
          </Form>
        </CardContent>
        <CardFooter className="justify-center border-t p-4 bg-muted/20">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <span>{t("لديك حساب؟", "Already have an account?")}</span>
            <Link href="/login" className="text-primary font-medium">
              {t("تسجيل الدخول", "Login")}
            </Link>
          </div>
        </CardFooter>
      </Card>
    </div>
  );
}
