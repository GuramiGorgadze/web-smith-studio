/** Unknown address under /api. */
export function apiNotFound(request, response) {
  response.status(404).json({ ok: false, error: { code: "not_found", message: "There is no API route at this address." } });
}

/** Any other address when the website is not being served from here. */
export function notFound(request, response) {
  response.status(404).type("text/plain").send("Not found");
}

/** Turns any error into a short JSON answer and logs the ones that are our fault. */
export function errorHandler(logger) {
  return (error, request, response, next) => {
    if (response.headersSent) {
      next(error);
      return;
    }

    const status = [error?.status, error?.statusCode].find((value) => Number.isInteger(value) && value >= 400 && value < 600) ?? 500;
    let code = "server_error";
    let message = "Something went wrong on our side.";

    if (error?.type === "entity.parse.failed") {
      code = "invalid_json";
      message = "The request body is not valid JSON.";
    } else if (error?.type === "entity.too.large") {
      code = "payload_too_large";
      message = "The request is too large.";
    } else if (status < 500) {
      code = "bad_request";
      message = "The request could not be understood.";
    }

    if (status >= 500) logger.error("Unhandled error", { path: request.path, reason: error?.message });
    response.status(status).json({ ok: false, error: { code, message } });
  };
}
