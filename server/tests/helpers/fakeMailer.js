/**
 * A mailer that records what it is asked to send, and can be told to fail.
 *
 *  - failNext(error)        makes the next send reject, whatever it is.
 *  - failKind(kind, error)  makes every send of that kind ("notification" or "auto-reply") reject.
 */
export function createFakeMailer() {
  /** @type {{ message: any, meta: any }[]} */
  const sent = [];
  const nextFailures = [];
  const kindFailures = new Map();

  return {
    mode: "smtp",
    sent,
    status: () => ({ mode: "smtp", verified: true }),

    failNext(error = new Error("SMTP is down")) {
      nextFailures.push(error);
    },

    failKind(kind, error = new Error("SMTP is down")) {
      kindFailures.set(kind, error);
    },

    async verify() {
      return true;
    },

    async send(message, meta = {}) {
      const failure = kindFailures.get(meta.kind) ?? nextFailures.shift();
      if (failure) throw failure;
      sent.push({ message, meta });
      return { messageId: `<fake-${sent.length}@test>`, accepted: [] };
    },

    close() {},
  };
}
