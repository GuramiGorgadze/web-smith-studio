import { GradientText } from "@/components/common/GradientText";
import { PageHero } from "@/components/common/PageHero";
import { Seo } from "@/components/layout/Seo";
import { ContactSection } from "@/components/sections/contact/ContactSection";
import { useI18n } from "@/i18n/I18nContext";
import { breadcrumbJsonLd } from "@/lib/structuredData";

/** Project inquiry form plus other ways to reach the studio. */
export default function ContactPage() {
  const i18n = useI18n();
  const { t, content } = i18n;
  const text = content.pages.contact;

  return (
    <>
      <Seo
        title={text.seoTitle}
        description={t(text.seoDescription)}
        path="/contact"
        jsonLd={breadcrumbJsonLd(i18n, [{ name: text.seoTitle, path: "/contact" }])}
      />

      <PageHero
        eyebrow={text.eyebrow}
        title={
          <>
            {text.titleLead} <GradientText>{text.titleHighlight}</GradientText>
          </>
        }
        description={t(text.description)}
      />

      <ContactSection />
    </>
  );
}
