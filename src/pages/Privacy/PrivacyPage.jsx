import { LegalPage } from "@/components/sections/legal/LegalPage";
import { useContent } from "@/i18n/I18nContext";

export default function PrivacyPage() {
  return <LegalPage doc={useContent().legal.privacy} path="/privacy" />;
}
