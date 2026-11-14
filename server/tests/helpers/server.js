import { createApp } from "../../src/app.js";
import { createLogger } from "../../src/lib/logger.js";
import { createInquiryService } from "../../src/mail/inquiryService.js";

/** Starts the real app on a free port. Returns its address, the service, and a close() function. */
export async function startApp({ config, mailer, logger = createLogger({ level: "silent" }) }) {
  const service = createInquiryService({ config, mailer, logger });
  const app = createApp({ config, mailer, logger, service });

  const server = await new Promise((resolve) => {
    const listening = app.listen(0, "127.0.0.1", () => resolve(listening));
  });

  return {
    baseUrl: `http://127.0.0.1:${server.address().port}`,
    service,
    close: () =>
      new Promise((resolve) => {
        server.close(() => resolve());
        server.closeAllConnections?.();
      }),
  };
}

/** POSTs JSON to /api/contact and returns the status, headers and parsed body. */
export async function postContact(baseUrl, body, headers = {}) {
  const response = await fetch(`${baseUrl}/api/contact`, {
    method: "POST",
    headers: { "Content-Type": "application/json", Accept: "application/json", ...headers },
    body: typeof body === "string" ? body : JSON.stringify(body),
  });
  return { status: response.status, headers: response.headers, json: await response.json().catch(() => null) };
}
