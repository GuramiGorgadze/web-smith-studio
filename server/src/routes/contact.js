import { Router } from "express";
import { parseInquiry } from "../lib/inquirySchema.js";
import { maskEmailsIn } from "../lib/text.js";

/**
 * POST /api/contact: validates the form, then hands it to the inquiry service.
 *
 * Answers:
 *   200 { ok: true, id }                         delivered (or silently dropped when the honeypot was filled)
 *   422 { ok: false, error: { fields } }         something to fix in the form
 *   429 { ok: false, error }                     too many messages from this address
 *   502 { ok: false, error }                     the email could not be sent right now
 */
export function createContactRouter({ config, service, logger, limiter }) {
  const router = Router();

  router.post("/contact", limiter, async (request, response) => {
    const body = request.body !== null && typeof request.body === "object" && !Array.isArray(request.body) ? request.body : {};

    // Real visitors never see or fill the hidden "website" field. Pretend it worked so bots learn nothing.
    if (typeof body.website === "string" && body.website.trim() !== "") {
      logger.warn("Honeypot field was filled, message dropped");
      response.status(200).json({ ok: true });
      return;
    }

    const parsed = parseInquiry(body);
    if (!parsed.success) {
      response.status(422).json({
        ok: false,
        error: { code: "validation_failed", message: "Some fields need another look.", fields: parsed.fields },
      });
      return;
    }

    try {
      const { id } = await service.deliver(parsed.data);
      response.status(200).json({ ok: true, id });
    } catch (error) {
      logger.error("Could not deliver an inquiry", { code: error?.code, reason: maskEmailsIn(error?.message) });
      response.status(502).json({
        ok: false,
        error: {
          code: "delivery_failed",
          message: `We could not deliver your message just now. Please try again in a moment, or email us at ${config.mail.to[0]}.`,
        },
      });
    }
  });

  router.all("/contact", (request, response) => {
    response
      .set("Allow", "POST, OPTIONS")
      .status(405)
      .json({ ok: false, error: { code: "method_not_allowed", message: "Send a POST request with the form data as JSON." } });
  });

  return router;
}
