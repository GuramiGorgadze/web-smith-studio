import { LegalPage } from "@/components/sections/legal/LegalPage";
import { useContent } from "@/i18n/I18nContext";

export default function TermsPage() {
  return <LegalPage doc={useContent().legal.terms} path="/terms" />;
}
