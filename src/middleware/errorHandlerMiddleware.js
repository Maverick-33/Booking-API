import logger from "../logger.js";
import * as Sentry from "@sentry/node";

export const errorHandler = (err, req, res, next) => {
  logger.error(err.stack);
  Sentry.captureException(err);
  res
    .status(500)
    .json({
      message:
        "An error occurred on the server, please double-check your request!",
    });
};
