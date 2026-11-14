import { simpleParser } from "mailparser";
import { SMTPServer } from "smtp-server";

/**
 * A real SMTP server on a free local port that keeps every message it receives (parsed), so tests can check
 * exactly what Nodemailer put on the wire. It can also demand a login and reject messages on purpose.
 */
export async function startSmtpSink({ user = "mailer", pass = "secret", requireAuth = false } = {}) {
  /** @type {{ mail: import("mailparser").ParsedMail, envelope: any }[]} */
  const received = [];
  const rejections = [];
  let attempts = 0;
  let authAttempts = 0;

  const server = new SMTPServer({
    authOptional: !requireAuth,
    allowInsecureAuth: true,
    disabledCommands: ["STARTTLS"],
    logger: false,

    onAuth(auth, session, callback) {
      authAttempts += 1;
      if (auth.username === user && auth.password === pass) callback(null, { user: auth.username });
      else callback(new Error("Invalid username or password"));
    },

    onData(stream, session, callback) {
      attempts += 1;
      const code = rejections.shift();

      if (code) {
        stream.resume();
        stream.on("end", () => callback(Object.assign(new Error(`Rejected with ${code}`), { responseCode: code })));
        return;
      }

      // skipImageLinks keeps the "cid:" image sources exactly as they were sent, instead of turning them into data URIs.
      simpleParser(stream, { skipImageLinks: true }).then(
        (mail) => {
          received.push({ mail, envelope: session.envelope });
          callback();
        },
        (error) => callback(error),
      );
    },
  });

  await new Promise((resolve) => server.listen(0, "127.0.0.1", resolve));

  return {
    port: server.server.address().port,
    received,
    /** How many messages the server was offered, including the ones it rejected. */
    attempts: () => attempts,
    /** How many times a client tried to log in. */
    authAttempts: () => authAttempts,
    /** Reject the next messages with these SMTP codes (451 = try again later, 550 = refused for good). */
    rejectNext: (...codes) => rejections.push(...codes),
    close: () => new Promise((resolve) => server.close(() => resolve())),
  };
}
