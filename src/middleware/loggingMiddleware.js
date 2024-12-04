import logger from "../logger.js";

export const logRequestDuration = (req, res, next) => {
  const start = Date.now();
  res.on("finish", () => {
    const duration = Date.now() - start;
    logger.info(
      `${req.method} ${req.originalUrl} [${res.statusCode}] - ${duration}ms`
    );
  });
  next();
};
