const express = require("express");
const createError = require("http-errors");
const helmet = require("helmet");
const xss = require("xss-clean");
const cors = require("cors");
const logger = require("./utils/logger");
require("dotenv").config();
const fs = require("fs");
const pool = require("./src/services/db");

const app = express();

// Middleware security and parsing
app.use(helmet());
app.use(xss());
app.use(express.json({ limit: "10kb" }));
app.use(cors());

const createTablesScript = fs.readFileSync(
  "./src/scripts/createTables.sql",
  "utf8"
);

pool
  .query(createTablesScript)
  .then(() => {
    logger.info("Setup script executed successfully.");
  })
  .catch((error) => {
    logger.error("Error executing setup script:", error);
  });

const userRouter = require("./routes/userRoutes");
app.use(userRouter);
const categoryRouter = require("./routes/categoryRoutes");
app.use(categoryRouter);
const postRouter = require("./routes/postRoutes");
app.use(postRouter);
const paymentRouter = require("./routes/paymentRoutes");
app.use(paymentRouter);

// Catch all requests not sent to the attached routes and send 404 response
app.use(function (req, res, next) {
  res.status(404).send(createError(404));
  logger.info(`SENT: 404 Not Found: ${req.originalUrl}`);
});

// Express error handler
app.use((err, req, res, next) => {
  const elements = [err.status, createError(err.status), err.message];
  res.status(err.status).send(createError(err.status));
  logger.info(`SENT: ${elements.join(" ")}`);
});

module.exports = app;
