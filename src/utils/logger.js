const winston = require("winston");
const path = require("path");
const moment = require("moment");

// Define your severity levels.
const levels = {
  error: 0,
  warn: 1,
  info: 2,
  http: 3,
  debug: 4,
};

// Colors make the log message more visible on the console
const colors = {
  error: "red",
  warn: "yellow",
  info: "green",
  http: "blue",
  debug: "white",
};

// Tell winston that you want to link the colors
winston.addColors(colors);

// Choose the aspect of your log customizing the file log format.
const format = winston.format.combine(
  winston.format.errors({ stack: true }),
  winston.format.timestamp({ format: "YYYY-MM-DD HH:mm:ss:ms" }),

  winston.format.printf((info) => {
    if (info.stack) {
      return `${info.timestamp}: ${info.message}: ${info.stack}`;
    }
    return `${info.timestamp} ${info.level}: ${info.message}`;
  })
);

// file name for the log
const logName = moment().format("DD_MMM_YYYY");

// Define which transports the logger must use to print out messages.
const transports = [
  // logs to the console
  new winston.transports.Console({
    level: "http",
  }),
];

// log to the console on development
if (process.env.NODE_ENV === "production") {
  transports.push(
    new winston.transports.File({
      filename: path.join(__dirname, `../../logs/${logName}.log`),
    })
  );
}

// Create the logger instance that has to be exported and used to log messages.
const logger = winston.createLogger({
  level: "http",
  levels,
  format,
  transports,
});

module.exports = logger;
