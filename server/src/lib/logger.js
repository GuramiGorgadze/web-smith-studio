const LEVELS = { debug: 10, info: 20, warn: 30, error: 40, silent: 100 };

/**
 * A very small logger. Pretty lines while developing, one JSON object per line in production
 * (which is what hosting dashboards expect).
 *
 * @param {{ level?: keyof typeof LEVELS, json?: boolean, write?: (line: string, level: string) => void }} [options]
 */
export function createLogger({ level = "info", json = false, write } = {}) {
  const threshold = LEVELS[level] ?? LEVELS.info;
  const output =
    write ??
    ((line, severity) => {
      if (severity === "error" || severity === "warn") console.error(line);
      else console.log(line);
    });

  function log(severity, message, fields) {
    if (LEVELS[severity] < threshold) return;
    const now = new Date();

    if (json) {
      output(JSON.stringify({ time: now.toISOString(), level: severity, message, ...fields }), severity);
      return;
    }

    const extras = fields && Object.keys(fields).length > 0 ? ` ${JSON.stringify(fields)}` : "";
    output(`${now.toTimeString().slice(0, 8)} ${severity.toUpperCase().padEnd(5)} ${message}${extras}`, severity);
  }

  return {
    debug: (message, fields) => log("debug", message, fields),
    info: (message, fields) => log("info", message, fields),
    warn: (message, fields) => log("warn", message, fields),
    error: (message, fields) => log("error", message, fields),
  };
}
