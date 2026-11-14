import { Outlet } from "react-router-dom";
import { Footer } from "@/components/layout/Footer";
import { Navbar } from "@/components/layout/Navbar";
import { ScrollManager } from "@/components/layout/ScrollManager";
import { Toaster } from "@/components/ui";
import { useI18n } from "@/i18n/I18nContext";
import styles from "./SiteLayout.module.scss";

/** Shell shared by every route: skip link, navigation, page outlet, footer and toasts. */
export function SiteLayout() {
  const { ui } = useI18n();

  return (
    <>
      <a href="#main" className="skipLink">
        {ui.skipLink}
      </a>
      <ScrollManager />
      <Navbar />
      <main id="main" tabIndex={-1} className={styles.main}>
        <Outlet />
      </main>
      <Footer />
      <Toaster containerAriaLabel={ui.toast.region} toastOptions={{ closeButtonAriaLabel: ui.toast.close }} />
    </>
  );
}
