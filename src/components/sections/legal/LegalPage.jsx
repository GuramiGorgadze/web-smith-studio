import { PageHero } from "@/components/common/PageHero";
import { Seo } from "@/components/layout/Seo";
import { LegalDocument } from "@/components/sections/legal/LegalDocument";
import { useI18n } from "@/i18n/I18nContext";
import { breadcrumbJsonLd } from "@/lib/structuredData";

/** Shared page shell for the privacy policy and the terms of service. `doc` comes from content.legal. */
export function LegalPage({ doc, path }) {
  const i18n = useI18n();

  return (
    <>
      <Seo
        title={doc.title}
        description={doc.intro}
        path={path}
        jsonLd={breadcrumbJsonLd(i18n, [{ name: doc.title, path }])}
      />
      <PageHero eyebrow={i18n.content.pages.legal.eyebrow} title={doc.title} description={doc.intro} />
      <LegalDocument doc={doc} />
    </>
  );
}
