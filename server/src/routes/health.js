import { Router } from "express";

/** GET /api/health: for uptime monitors. Reports the mail mode and whether the SMTP login worked at startup. */
export function createHealthRouter({ mailer }) {
  const router = Router();

  router.get("/health", (request, response) => {
    response.json({ ok: true, mail: mailer.status() });
  });

  return router;
}
