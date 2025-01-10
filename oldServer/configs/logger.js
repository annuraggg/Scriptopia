import winston from "winston";

// Function to format timestamp in IST
const getISTTimestamp = () => {
  const date = new Date();
  const ISTOffset = 330; // IST is UTC+5.5 in minutes
  const ISTTime = new Date(date.getTime() + ISTOffset * 60 * 1000);
  return ISTTime.toISOString();
};

const logger = winston.createLogger({
  format: winston.format.json(),
  transports: [
    new winston.transports.Console({
      format: winston.format.combine(
        winston.format.timestamp({ format: getISTTimestamp }), // Add the timestamp to the log in IST
        winston.format.printf(({ timestamp, level, message, code, mid }) => {
          return `[${timestamp}] ${
            level.charAt(0).toUpperCase() + level.slice(1)
          }: ${code}: ${message} ${mid ? `by [MID: ${mid}]`: ""}`;
        })
      ),
    }),
    new winston.transports.File({
      filename: "server.log",
      format: winston.format.combine(
        winston.format.timestamp({ format: getISTTimestamp }), // Add the timestamp to the log in IST
        winston.format.printf(({ timestamp, level, code, message, mid }) => {
          return `[${timestamp}] ${
            level.charAt(0).toUpperCase() + level.slice(1)
          }: ${code}: ${message} ${mid ? `by [MID: ${mid}]` : ""}`;
        })
      ),
    }),
  ],
  level: "debug",
});

logger.info({ code: "MN-SRV-100", message: "Server started successfully" });

export default logger;
