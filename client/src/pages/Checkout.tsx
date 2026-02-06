import { useCart } from "@/hooks/use-cart";
import { useLanguage } from "@/hooks/use-language";
import { useAuth } from "@/hooks/use-auth";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { insertOrderSchema } from "@shared/schema";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useToast } from "@/hooks/use-toast";
import { useLocation } from "wouter";
import { useMutation } from "@tanstack/react-query";
import { ShoppingBag, Truck, CreditCard, Loader2, CheckCircle2 } from "lucide-react";
import { useState } from "react";

const checkoutSchema = z.object({
  customerName: z.string().min(2, "Name is required"),
  phone: z.string().min(8, "Valid phone number required"),
  address: z.string().min(5, "Full address required"),
  city: z.string().min(2, "City is required"),
  notes: z.string().optional(),
});

export default function Checkout() {
  const { items, total, clearCart } = useCart();
  const { t, language } = useLanguage();
  const { user } = useAuth();
  const { toast } = useToast();
  const [, setLocation] = useLocation();
  const [orderPlaced, setOrderPlaced] = useState(false);

  const form = useForm<z.infer<typeof checkoutSchema>>({
    resolver: zodResolver(checkoutSchema),
    defaultValues: {
      customerName: user?.name || "",
      phone: user?.phone || "",
      address: user?.address || "",
      city: user?.city || "",
      notes: "",
    },
  });

  const createOrder = useMutation({
    mutationFn: async (data: z.infer<typeof checkoutSchema>) => {
      const res = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          ...data,
          items: items.map(i => ({ bookId: i.book.id, quantity: i.quantity })),
        }),
      });
      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.message || "Order failed");
      }
      return res.json();
    },
    onSuccess: () => {
      clearCart();
      setOrderPlaced(true);
      toast({ title: t("تم الطلب بنجاح", "Order placed successfully!") });
    },
    onError: (err) => {
      toast({ title: t("خطأ", "Error"), description: err.message, variant: "destructive" });
    },
  });

  if (orderPlaced) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4 page-transition">
        <Card className="max-w-md w-full text-center p-8">
          <div className="flex justify-center mb-6">
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center">
              <CheckCircle2 className="w-10 h-10 text-green-600" />
            </div>
          </div>
          <h2 className="text-2xl font-bold font-serif mb-2" data-testid="text-order-success">
            {t("تم استلام طلبك", "Order Received!")}
          </h2>
          <p className="text-muted-foreground mb-6">
            {t("سنتواصل معك قريباً لتأكيد الطلب والتوصيل.", "We'll contact you soon to confirm delivery details.")}
          </p>
          <p className="text-sm text-muted-foreground mb-8">
            {t("طريقة الدفع: الدفع عند الاستلام", "Payment: Cash on Delivery")}
          </p>
          <div className="flex gap-3 justify-center flex-wrap">
            <Button onClick={() => setLocation("/store")} data-testid="button-continue-shopping">
              {t("مواصلة التسوق", "Continue Shopping")}
            </Button>
            <Button variant="outline" onClick={() => setLocation("/")} data-testid="button-go-home">
              {t("الصفحة الرئيسية", "Go Home")}
            </Button>
          </div>
        </Card>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <Card className="max-w-md w-full text-center p-8">
          <ShoppingBag className="w-16 h-16 mx-auto mb-4 opacity-20" />
          <h2 className="text-xl font-bold mb-2">{t("السلة فارغة", "Cart is empty")}</h2>
          <Button onClick={() => setLocation("/store")}>{t("تصفح الكتب", "Browse Books")}</Button>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background py-8 page-transition">
      <div className="container mx-auto px-4 max-w-4xl">
        <h1 className="text-3xl font-serif font-bold mb-8" data-testid="text-checkout-title">
          {t("إتمام الطلب", "Checkout")}
        </h1>

        <div className="grid md:grid-cols-5 gap-8">
          <div className="md:col-span-3">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Truck className="w-5 h-5" />
                  {t("معلومات التوصيل", "Delivery Information")}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Form {...form}>
                  <form onSubmit={form.handleSubmit((data) => createOrder.mutate(data))} className="space-y-4">
                    <FormField
                      control={form.control}
                      name="customerName"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>{t("الاسم الكامل", "Full Name")}</FormLabel>
                          <FormControl><Input {...field} data-testid="input-customer-name" /></FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="phone"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>{t("رقم الهاتف", "Phone Number")}</FormLabel>
                          <FormControl><Input {...field} type="tel" data-testid="input-phone" /></FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="city"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>{t("الولاية / المدينة", "City / State")}</FormLabel>
                          <FormControl><Input {...field} data-testid="input-city" /></FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="address"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>{t("العنوان بالكامل", "Full Address")}</FormLabel>
                          <FormControl><Textarea {...field} data-testid="input-address" /></FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="notes"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>{t("ملاحظات (اختياري)", "Notes (optional)")}</FormLabel>
                          <FormControl><Textarea {...field} data-testid="input-notes" /></FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <div className="pt-4 border-t">
                      <div className="flex items-center gap-2 text-sm text-muted-foreground mb-4">
                        <CreditCard className="w-4 h-4" />
                        {t("الدفع عند الاستلام", "Cash on Delivery")}
                      </div>
                      <Button type="submit" className="w-full" size="lg" disabled={createOrder.isPending} data-testid="button-place-order">
                        {createOrder.isPending ? (
                          <Loader2 className="animate-spin" />
                        ) : (
                          t("تأكيد الطلب", "Place Order")
                        )}
                      </Button>
                    </div>
                  </form>
                </Form>
              </CardContent>
            </Card>
          </div>

          <div className="md:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <ShoppingBag className="w-5 h-5" />
                  {t("ملخص الطلب", "Order Summary")}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {items.map(({ book, quantity }) => (
                  <div key={book.id} className="flex gap-3" data-testid={`checkout-item-${book.id}`}>
                    <img src={book.image} alt="" className="w-12 h-16 object-cover rounded" />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium line-clamp-1">
                        {language === "ar" ? book.titleAr : book.titleEn}
                      </p>
                      <p className="text-xs text-muted-foreground">x{quantity}</p>
                    </div>
                    <p className="text-sm font-bold whitespace-nowrap">
                      {(Number(book.price) * quantity).toLocaleString()} DZD
                    </p>
                  </div>
                ))}
                <div className="border-t pt-4 flex justify-between font-bold text-lg">
                  <span>{t("المجموع", "Total")}</span>
                  <span className="text-primary" data-testid="checkout-total">{total.toLocaleString()} DZD</span>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
