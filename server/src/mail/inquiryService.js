import { randomBytes } from "node:crypto";
import { createWindowLimiter } from "../lib/windowLimiter.js";
import { displayName, maskEmail, maskEmailsIn, truncate } from "../lib/text.js";
import { inlineImages, check, logo } from "./assets.js";
import { renderAutoReply } from "./autoReply.js";
import { renderNotification } from "./notification.js";

/** A short reference such as "a3f91c2e", shown in both emails and returned to the website. */
export function createReference() {
  return randomBytes(4).toString("hex");
}

/**
 * Turns a validated inquiry into emails: the notification to the studio first (this must succeed), then the
 * visitor's confirmation in the background (nice to have, and limited per address).
 *
 * @param {{ config: any, mailer: { send: Function }, logger: ReturnType<typeof import("../lib/logger.js").createLogger> }} options
 */
export function createInquiryService({ config, mailer, logger }) {
  const { autoReply } = config.mail;
  const limiter = createWindowLimiter({ windowMs: autoReply.windowMs, max: autoReply.maxPerEmail });
  /** @type {Set<Promise<void>>} */
  const pending = new Set();

  async function sendConfirmation({ inquiry, id, receivedAt }) {
    if (!limiter.take(inquiry.email)) {
      logger.warn("Confirmation skipped, this address has had its share for now", { id, to: maskEmail(inquiry.email) });
      return;
    }

    const rendered = renderAutoReply({ inquiry, id, receivedAt, config });
    const info = await mailer.send(
      {
        from: config.mail.from,
        to: inquiry.email,
        replyTo: config.mail.to[0],
        subject: rendered.subject,
        text: rendered.text,
        html: rendered.html,
        attachments: inlineImages(logo, check),
        headers: {
          // Tells other mail systems this is automatic, so they do not auto-reply back to it.
          "Auto-Submitted": "auto-replied",
          "X-Auto-Response-Suppress": "All",
          "X-Inquiry-Id": id,
        },
      },
      { kind: "auto-reply", id },
    );
    logger.info("Confirmation sent", { id, to: maskEmail(inquiry.email), messageId: info.messageId });
  }

  return {
    /**
     * Sends the notification and schedules the confirmation. Rejects when the notification could not be sent.
     * @param {import("zod").infer<typeof import("../lib/inquirySchema.js").inquirySchema>} inquiry
     */
    async deliver(inquiry) {
      const id = createReference();
      const receivedAt = new Date();
      const rendered = renderNotification({ inquiry, id, receivedAt, config });
      const sender = displayName(inquiry.name);

      const info = await mailer.send(
        {
          // The sender's name in the list view makes the inbox easy to scan; replies still go to the visitor.
          from: { name: truncate(sender ? `${sender} via ${config.site.name}` : config.site.name, 80), address: config.mail.from.address },
          to: config.mail.to,
          replyTo: { name: sender, address: inquiry.email },
          subject: rendered.subject,
          text: rendered.text,
          html: rendered.html,
          attachments: inlineImages(logo),
          priority: rendered.urgent ? "high" : "normal",
          headers: { "X-Inquiry-Id": id },
        },
        { kind: "notification", id },
      );
      logger.info("Inquiry delivered", {
        id,
        recipients: config.mail.to.length,
        from: maskEmail(inquiry.email),
        locale: inquiry.locale,
        messageId: info.messageId,
      });

      if (autoReply.enabled) {
        const task = sendConfirmation({ inquiry, id, receivedAt })
          .catch((error) => logger.warn("Confirmation could not be sent", { id, code: error?.code, reason: maskEmailsIn(error?.message) }))
          .finally(() => pending.delete(task));
        pending.add(task);
      }

      return { id, receivedAt };
    },

    /** Resolves when every background confirmation has finished. Used on shutdown and in tests. */
    async idle() {
      await Promise.allSettled([...pending]);
    },
  };
}
