import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import nodemailer from "nodemailer";
import { cidToFilePaths } from "./assets.js";

// Network errors that are worth one more try. Permanent answers (wrong password, rejected address) are not.
const TRANSIENT_CODES = new Set(["ETIMEDOUT", "ECONNRESET", "ECONNREFUSED", "ECONNECTION", "ESOCKET", "EDNS", "EAI_AGAIN"]);

/** True for timeouts, dropped connections and SMTP 4xx answers ("try again later"). */
export function isTransient(error) {
  if (TRANSIENT_CODES.has(error?.code)) return true;
  const status = error?.responseCode;
  return typeof status === "number" && status >= 400 && status < 500;
}

const wait = (milliseconds) => new Promise((resolve) => setTimeout(resolve, milliseconds));

/**
 * Creates the object that actually sends mail.
 *
 *  - smtp mode: sends through your SMTP account with Nodemailer, retrying once on a transient failure.
 *  - preview mode: sends nothing. It builds the real message and saves it as .eml and .html files, so you can
 *    see exactly how the emails look before any mail account exists.
 *
 * @param {{ config: any, logger: ReturnType<typeof import("../lib/logger.js").createLogger>, sleep?: (ms: number) => Promise<void> }} options
 */
export function createMailer({ config, logger, sleep = wait }) {
  return config.mail.mode === "smtp" ? createSmtpMailer({ config, logger, sleep }) : createPreviewMailer({ config, logger });
}

function createSmtpMailer({ config, logger, sleep }) {
  const { smtp } = config.mail;
  const attempts = 2;
  let verified = null;

  const transporter = nodemailer.createTransport({
    host: smtp.host,
    port: smtp.port,
    secure: smtp.secure,
    requireTLS: smtp.requireTLS,
    auth: smtp.user ? { user: smtp.user, pass: smtp.pass } : undefined,
    connectionTimeout: 8_000,
    greetingTimeout: 8_000,
    socketTimeout: 20_000,
  });

  return {
    mode: "smtp",

    status: () => ({ mode: "smtp", verified }),

    /** Opens a connection and logs in, without sending anything. Throws when the settings are wrong. */
    async verify() {
      try {
        await transporter.verify();
        verified = true;
        return true;
      } catch (error) {
        verified = false;
        throw error;
      }
    },

    async send(message, meta = {}) {
      let lastError;
      for (let attempt = 1; attempt <= attempts; attempt += 1) {
        try {
          const info = await transporter.sendMail(message);
          return { messageId: info.messageId, accepted: info.accepted };
        } catch (error) {
          lastError = error;
          if (attempt === attempts || !isTransient(error)) break;
          logger.warn("Sending failed, trying once more", { kind: meta.kind, code: error.code, attempt });
          await sleep(800 * attempt);
        }
      }
      throw lastError;
    },

    close() {
      transporter.close();
    },
  };
}

function createPreviewMailer({ config, logger }) {
  const directory = config.mail.previewDir;
  const builder = nodemailer.createTransport({ streamTransport: true, buffer: true, newline: "unix" });
  let counter = 0;

  return {
    mode: "preview",

    status: () => ({ mode: "preview", verified: true }),

    async verify() {
      return true;
    },

    async send(message, meta = {}) {
      await mkdir(directory, { recursive: true });
      const built = await builder.sendMail(message);

      counter += 1;
      const stamp = new Date().toISOString().replace(/[:.]/g, "-");
      const name = `${stamp}-${String(counter).padStart(2, "0")}-${meta.kind ?? "email"}${meta.id ? `-${meta.id}` : ""}`;
      const files = { eml: path.join(directory, `${name}.eml`), html: path.join(directory, `${name}.html`) };

      await writeFile(files.eml, built.message);
      await writeFile(files.html, cidToFilePaths(String(message.html ?? ""), directory));

      logger.info("Preview saved, nothing was sent", { kind: meta.kind, open: files.html });
      return { messageId: built.messageId, accepted: [], files };
    },

    close() {},
  };
}
