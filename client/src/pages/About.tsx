import { useLanguage } from "@/hooks/use-language";
import { useQuery } from "@tanstack/react-query";
import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent } from "@/components/ui/card";
import { Phone, Mail, MapPin, BookOpen, Eye } from "lucide-react";
import type { SitePage } from "@shared/schema";

export default function About() {
  const { t, language, dir } = useLanguage();
  const { data: page, isLoading } = useQuery<SitePage>({
    queryKey: ["/api/pages/about"],
  });

  const extraData = page?.extraData ? JSON.parse(page.extraData) : null;

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background" dir={dir}>
        <div className="bg-primary py-16">
          <div className="container mx-auto px-4 text-center">
            <Skeleton className="h-10 w-64 mx-auto mb-4 bg-primary-foreground/20" />
            <Skeleton className="h-6 w-96 mx-auto bg-primary-foreground/20" />
          </div>
        </div>
        <div className="container mx-auto px-4 py-12 space-y-12">
          <div className="space-y-4">
            <Skeleton className="h-8 w-48" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-3/4" />
          </div>
          <div className="space-y-4">
            <Skeleton className="h-8 w-48" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-3/4" />
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            <Skeleton className="h-32" />
            <Skeleton className="h-32" />
            <Skeleton className="h-32" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background" dir={dir} data-testid="about-page">
      <div className="bg-primary text-primary-foreground py-16 md:py-24">
        <div className="container mx-auto px-4 text-center">
          <BookOpen className="w-12 h-12 mx-auto mb-4 opacity-80" />
          <h1 className="text-3xl md:text-5xl font-serif font-bold mb-4" data-testid="text-about-title">
            {page ? t(page.titleAr, page.titleEn) : t("من نحن", "About Us")}
          </h1>
        </div>
      </div>

      <div className="container mx-auto px-4 py-12 space-y-16">
        <section data-testid="section-about-content">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-2xl md:text-3xl font-serif font-bold mb-6" data-testid="text-about-heading">
              {t("من نحن", "About Us")}
            </h2>
            <div className="text-muted-foreground leading-relaxed text-lg whitespace-pre-line" data-testid="text-about-content">
              {page ? t(page.contentAr, page.contentEn) : ""}
            </div>
          </div>
        </section>

        {extraData && (extraData.visionAr || extraData.visionEn) && (
          <section data-testid="section-vision">
            <div className="max-w-3xl mx-auto">
              <Card>
                <CardContent className="p-8">
                  <div className="flex items-center gap-3 mb-6">
                    <Eye className="w-6 h-6 text-primary" />
                    <h2 className="text-2xl md:text-3xl font-serif font-bold" data-testid="text-vision-heading">
                      {t("رؤيتنا", "Our Vision")}
                    </h2>
                  </div>
                  <p className="text-muted-foreground leading-relaxed text-lg" data-testid="text-vision-content">
                    {t(extraData.visionAr || "", extraData.visionEn || "")}
                  </p>
                </CardContent>
              </Card>
            </div>
          </section>
        )}

        {extraData && (extraData.phone || extraData.email || extraData.addressAr || extraData.addressEn) && (
          <section data-testid="section-contact">
            <div className="max-w-3xl mx-auto">
              <h2 className="text-2xl md:text-3xl font-serif font-bold mb-6 text-center" data-testid="text-contact-heading">
                {t("تواصل معنا", "Contact Us")}
              </h2>
              <div className="grid md:grid-cols-3 gap-6">
                {extraData.phone && (
                  <Card>
                    <CardContent className="p-6 flex flex-col items-center text-center gap-3">
                      <Phone className="w-8 h-8 text-primary" />
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
                  <Card>
                    <CardContent className="p-6 flex flex-col items-center text-center gap-3">
                      <Mail className="w-8 h-8 text-primary" />
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
                  <Card>
                    <CardContent className="p-6 flex flex-col items-center text-center gap-3">
                      <MapPin className="w-8 h-8 text-primary" />
                      <h3 className="font-semibold">{t("العنوان", "Address")}</h3>
                      <p className="text-muted-foreground" data-testid="text-contact-address">
                        {t(extraData.addressAr || "", extraData.addressEn || "")}
                      </p>
                    </CardContent>
                  </Card>
                )}
              </div>
            </div>
          </section>
        )}
      </div>
    </div>
  );
}
