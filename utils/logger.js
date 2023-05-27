const { createLogger, format, transports } = require("winston");

const logFormat = format.combine(
  format.colorize(),
  format.timestamp(),
  format.align(),
  format.printf((info) => `${info.timestamp} ${info.level}: ${info.message}`)
);

const logger = createLogger({
  format: logFormat,
  transports: [new transports.Console()],
});

module.exports = logger;
