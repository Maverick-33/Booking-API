import express from "express";
import bodyParser from "body-parser";
import logger from "./logger.js";
import userRoutes from "./routes/userRoutes.js";
import bookingRoutes from "./routes/bookingRoutes.js";
import propertyRoutes from "./routes/propertyRoutes.js";
import reviewRoutes from "./routes/reviewRoutes.js";
import hostRoutes from "./routes/hostRoutes.js";
import amenityRoutes from "./routes/amenityRoutes.js";
import authRoutes from "./routes/authRoutes.js";
import * as Sentry from "@sentry/node";
import * as Tracing from "@sentry/tracing";

const app = express();

Sentry.init({
  dsn: process.env.SENTRY_DSN,
  integrations: [
    new Sentry.Integrations.Http({ tracing: true }),
    new Tracing.Integrations.Express({ app }),
  ],
  tracesSampleRate: 1.0,
});

const port = process.env.PORT || 3000;

app.use(Sentry.Handlers.requestHandler());
app.use(Sentry.Handlers.tracingHandler());

app.use(bodyParser.json());

app.use("/users", userRoutes);
app.use("/bookings", bookingRoutes);
app.use("/properties", propertyRoutes);
app.use("/reviews", reviewRoutes);
app.use("/hosts", hostRoutes);
app.use("/amenities", amenityRoutes);
app.use("/login", authRoutes);

app.use(Sentry.Handlers.errorHandler());

app.listen(port, () => {
  logger.info(`Server is running on port ${port}`);
});
