import winston from "winston";

const transports: winston.transport[] = [
  new winston.transports.Console()
];

if (process.env.NODE_ENV !== "production") {
  transports.push(
    new winston.transports.File({
      filename: "logs/error.log",
      level: "error"
    }),
    new winston.transports.File({
      filename: "logs/combined.log"
    })
  );
}

const logger = winston.createLogger({
  level: "info",
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.json()
  ),
  transports
});

export default logger;