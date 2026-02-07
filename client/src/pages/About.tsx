import { useState, useEffect } from "react";
import { useLanguage } from "@/hooks/use-language";
import { useAuth } from "@/hooks/use-auth";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest, apiUrl } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Phone, Mail, MapPin, BookOpen, Eye, Target, Pencil, Upload, X, Save, Loader2 } from "lucide-react";
import type { SitePage } from "@shared/schema";

function AdminEditDialog({ page, extraData }: { page: SitePage | null; extraData: any }) {
  const { t } = useLanguage();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [open, setOpen] = useState(false);

  const [titleAr, setTitleAr] = useState("");
  const [titleEn, setTitleEn] = useState("");
  const [contentAr, setContentAr] = useState("");
  const [contentEn, setContentEn] = useState("");
  const [visionAr, setVisionAr] = useState("");
  const [visionEn, setVisionEn] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [addressAr, setAddressAr] = useState("");
  const [addressEn, setAddressEn] = useState("");
  const [imageUrl, setImageUrl] = useState("");

  useEffect(() => {
    if (page && open) {
      setTitleAr(page.titleAr || "");
      setTitleEn(page.titleEn || "");
      setContentAr(page.contentAr || "");
      setContentEn(page.contentEn || "");
      setImageUrl(page.imageUrl || "");
      if (extraData) {
        setVisionAr(extraData.visionAr || "");
        setVisionEn(extraData.visionEn || "");
        setPhone(extraData.phone || "");
        setEmail(extraData.email || "");
        setAddressAr(extraData.addressAr || "");
        setAddressEn(extraData.addressEn || "");
      }
    }
  }, [page, extraData, open]);

  const saveMutation = useMutation({
    mutationFn: async () => {
      const ed = JSON.stringify({ visionAr, visionEn, phone, email, addressAr, addressEn });
      await apiRequest("PUT", "/api/admin/pages/about", { titleAr, titleEn, contentAr, contentEn, imageUrl, extraData: ed });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/pages/about"] });
      toast({ title: t("تم الحفظ بنجاح", "Saved successfully") });
      setOpen(false);
    },
    onError: () => toast({ title: t("فشل الحفظ", "Save failed"), variant: "destructive" }),
  });

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const fd = new FormData();
    fd.append("file", file);
    try {
      const res = await fetch(apiUrl("/api/upload"), { method: "POST", body: fd, credentials: "include" });
      const data = await res.json();
      if (data.url) setImageUrl(data.url);
    } catch {}
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          size="icon"
          variant="default"
          className="fixed bottom-6 end-6 z-50 shadow-lg rounded-full"
          data-testid="button-edit-about"
        >
          <Pencil className="w-5 h-5" />
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="font-serif">{t("تعديل صفحة من نحن", "Edit About Page")}</DialogTitle>
        </DialogHeader>

        <div className="space-y-6 mt-4">
          <div>
            <Label className="mb-2 block">{t("صورة الصفحة", "Page Image")}</Label>
            <div className="flex items-center gap-3">
              <Input value={imageUrl} onChange={(e) => setImageUrl(e.target.value)} placeholder="URL" className="flex-1" data-testid="input-about-image" />
              <label>
                <Button type="button" variant="outline" size="icon" onClick={() => document.getElementById("about-img-upload")?.click()}>
                  <Upload className="w-4 h-4" />
                </Button>
                <input id="about-img-upload" type="file" accept="image/*" className="hidden" onChange={handleImageUpload} />
              </label>
              {imageUrl && (
                <Button type="button" variant="ghost" size="icon" onClick={() => setImageUrl("")}>
                  <X className="w-4 h-4" />
                </Button>
              )}
            </div>
            {imageUrl && <img src={imageUrl} alt="" className="mt-2 h-32 rounded-md object-cover" />}
          </div>

          <Tabs defaultValue="ar">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="ar">{t("العربية", "Arabic")}</TabsTrigger>
              <TabsTrigger value="en">{t("الإنجليزية", "English")}</TabsTrigger>
            </TabsList>
            <TabsContent value="ar" className="space-y-4 mt-4">
              <div>
                <Label>{t("العنوان", "Title")}</Label>
                <Input value={titleAr} onChange={(e) => setTitleAr(e.target.value)} dir="rtl" data-testid="input-edit-title-ar" />
              </div>
              <div>
                <Label className="text-primary font-bold">{t("قصة دار النشر", "Publishing House Story")}</Label>
                <Textarea value={contentAr} onChange={(e) => setContentAr(e.target.value)} dir="rtl" rows={6} data-testid="input-edit-content-ar" />
              </div>
              <div>
                <Label className="text-primary font-bold">{t("الرؤية والهدف", "Vision & Goal")}</Label>
                <Textarea value={visionAr} onChange={(e) => setVisionAr(e.target.value)} dir="rtl" rows={4} data-testid="input-edit-vision-ar" />
              </div>
              <div>
                <Label>{t("العنوان البريدي", "Postal Address")}</Label>
                <Input value={addressAr} onChange={(e) => setAddressAr(e.target.value)} dir="rtl" data-testid="input-edit-address-ar" />
              </div>
            </TabsContent>
            <TabsContent value="en" className="space-y-4 mt-4">
              <div>
                <Label>{t("العنوان", "Title")}</Label>
                <Input value={titleEn} onChange={(e) => setTitleEn(e.target.value)} data-testid="input-edit-title-en" />
              </div>
              <div>
                <Label className="text-primary font-bold">{t("قصة دار النشر", "Publishing House Story")}</Label>
                <Textarea value={contentEn} onChange={(e) => setContentEn(e.target.value)} rows={6} data-testid="input-edit-content-en" />
              </div>
              <div>
                <Label className="text-primary font-bold">{t("الرؤية والهدف", "Vision & Goal")}</Label>
                <Textarea value={visionEn} onChange={(e) => setVisionEn(e.target.value)} rows={4} data-testid="input-edit-vision-en" />
              </div>
              <div>
                <Label>{t("العنوان البريدي", "Postal Address")}</Label>
                <Input value={addressEn} onChange={(e) => setAddressEn(e.target.value)} data-testid="input-edit-address-en" />
              </div>
            </TabsContent>
          </Tabs>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label>{t("الهاتف", "Phone")}</Label>
              <Input value={phone} onChange={(e) => setPhone(e.target.value)} dir="ltr" data-testid="input-edit-phone" />
            </div>
            <div>
              <Label>{t("البريد الإلكتروني", "Email")}</Label>
              <Input value={email} onChange={(e) => setEmail(e.target.value)} dir="ltr" data-testid="input-edit-email" />
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t">
            <Button variant="outline" onClick={() => setOpen(false)} data-testid="button-cancel-edit">
              {t("إلغاء", "Cancel")}
            </Button>
            <Button onClick={() => saveMutation.mutate()} disabled={saveMutation.isPending} className="gap-2" data-testid="button-save-about">
              {saveMutation.isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
              {t("حفظ التغييرات", "Save Changes")}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

export default function About() {
  const { t, language, dir } = useLanguage();
  const { user } = useAuth();
  const isAdmin = user && (user.role === "admin" || user.role === "employee");
  const { data: page, isLoading } = useQuery<SitePage>({
    queryKey: ["/api/pages/about"],
  });

  const extraData = page?.extraData ? JSON.parse(page.extraData) : null;

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background" dir={dir}>
        <div className="relative h-64 md:h-80 bg-primary">
          <div className="absolute inset-0 flex items-center justify-center">
            <Skeleton className="h-12 w-72 bg-primary-foreground/20" />
          </div>
        </div>
        <div className="container mx-auto px-4 py-12 space-y-12 max-w-4xl">
          <div className="space-y-4">
            <Skeleton className="h-8 w-48" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-3/4" />
          </div>
          <Skeleton className="h-40 w-full rounded-md" />
          <div className="grid md:grid-cols-3 gap-6">
            <Skeleton className="h-36" />
            <Skeleton className="h-36" />
            <Skeleton className="h-36" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background page-transition" dir={dir} data-testid="about-page">
      <div className="relative h-64 md:h-80 overflow-hidden">
        {page?.imageUrl ? (
          <>
            <img
              src={page.imageUrl}
              alt={language === "ar" ? page.titleAr : page.titleEn}
              className="absolute inset-0 w-full h-full object-cover"
              data-testid="img-about-hero"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/50 to-black/30" />
          </>
        ) : (
          <div className="absolute inset-0 bg-primary" />
        )}
        <div className="absolute inset-0 flex flex-col items-center justify-center text-white px-4">
          <BookOpen className="w-10 h-10 mb-4 opacity-90" />
          <h1 className="text-3xl md:text-5xl font-serif font-bold text-center" data-testid="text-about-title">
            {page ? t(page.titleAr, page.titleEn) : t("من نحن", "About Us")}
          </h1>
          <p className="mt-3 text-lg opacity-80 text-center max-w-xl">
            {t("دار علي بن زيد للطباعة والنشر", "Dar Ali BenZid for Printing & Publishing")}
          </p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-12 md:py-16 space-y-16 max-w-4xl">
        {(page?.contentAr || page?.contentEn) && (
          <section className="page-transition" data-testid="section-story">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-md bg-primary/10 flex items-center justify-center shrink-0">
                <BookOpen className="w-5 h-5 text-primary" />
              </div>
              <h2 className="text-2xl md:text-3xl font-serif font-bold" data-testid="text-story-heading">
                {t("قصة دار النشر", "Our Story")}
              </h2>
            </div>
            <div className="text-muted-foreground leading-relaxed text-lg whitespace-pre-line" data-testid="text-about-content">
              {page ? t(page.contentAr, page.contentEn) : ""}
            </div>
          </section>
        )}

        {extraData && (extraData.visionAr || extraData.visionEn) && (
          <section className="page-transition" data-testid="section-vision">
            <Card className="border-primary/20 bg-primary/[0.03]">
              <CardContent className="p-8">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 rounded-md bg-primary/10 flex items-center justify-center shrink-0">
                    <Target className="w-5 h-5 text-primary" />
                  </div>
                  <h2 className="text-2xl md:text-3xl font-serif font-bold" data-testid="text-vision-heading">
                    {t("رؤيتنا وهدفنا", "Our Vision & Goal")}
                  </h2>
                </div>
                <p className="text-muted-foreground leading-relaxed text-lg" data-testid="text-vision-content">
                  {t(extraData.visionAr || "", extraData.visionEn || "")}
                </p>
              </CardContent>
            </Card>
          </section>
        )}

        {extraData && (extraData.phone || extraData.email || extraData.addressAr || extraData.addressEn) && (
          <section className="page-transition" data-testid="section-contact">
            <div className="flex items-center gap-3 mb-8">
              <div className="w-10 h-10 rounded-md bg-primary/10 flex items-center justify-center shrink-0">
                <Mail className="w-5 h-5 text-primary" />
              </div>
              <h2 className="text-2xl md:text-3xl font-serif font-bold" data-testid="text-contact-heading">
                {t("تواصل معنا", "Contact Us")}
              </h2>
            </div>
            <div className="grid md:grid-cols-3 gap-6">
              {extraData.phone && (
                <Card className="hover-elevate">
                  <CardContent className="p-6 flex flex-col items-center text-center gap-3">
                    <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                      <Phone className="w-5 h-5 text-primary" />
                    </div>
                    <h3 className="font-semibold">{t("الهاتف", "Phone")}</h3>
                    <a
                      href={`tel:${extraData.phone}`}
                      className="text-muted-foreground"
                      dir="ltr"
                      data-testid="text-contact-phone"
                    >
                      {extraData.phone}
                    </a>
                  </CardContent>
                </Card>
              )}

              {extraData.email && (
                <Card className="hover-elevate">
                  <CardContent className="p-6 flex flex-col items-center text-center gap-3">
                    <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                      <Mail className="w-5 h-5 text-primary" />
                    </div>
                    <h3 className="font-semibold">{t("البريد الإلكتروني", "Email")}</h3>
                    <a
                      href={`mailto:${extraData.email}`}
                      className="text-muted-foreground break-all"
                      data-testid="text-contact-email"
                    >
                      {extraData.email}
                    </a>
                  </CardContent>
                </Card>
              )}

              {(extraData.addressAr || extraData.addressEn) && (
                <Card className="hover-elevate">
                  <CardContent className="p-6 flex flex-col items-center text-center gap-3">
                    <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                      <MapPin className="w-5 h-5 text-primary" />
                    </div>
                    <h3 className="font-semibold">{t("العنوان", "Address")}</h3>
                    <p className="text-muted-foreground" data-testid="text-contact-address">
                      {t(extraData.addressAr || "", extraData.addressEn || "")}
                    </p>
                  </CardContent>
                </Card>
              )}
            </div>
          </section>
        )}
      </div>

      {isAdmin && <AdminEditDialog page={page || null} extraData={extraData} />}
    </div>
  );
}
