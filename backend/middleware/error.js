const winston = require('winston');
const { combine, timestamp } = winston.format;

const logger = winston.createLogger({
  level: 'info',
  format: combine(
    timestamp(new Date()),
    winston.format.json()
  ),
  transports: [
    // - Write all logs error (and below) to `error.log`.
    new winston.transports.File({
      filename: 'error.log',
      level: 'error',
      handleExceptions: true
    }),
    // - Write all level logs to console.
    // But in here we are not creating any 'info' logs. So only errors will appear on console.
    new winston.transports.Console({
      handleExceptions: true
    })
  ],
  exitOnError: false // node will continue running even after uncaughtException
});

module.exports = function (error, req, res, next) {
  // Log the exception. We are only logging error level logs.
  logger.error(error.message, error);
  res.status(500).send('Something failed. Unknown error.');
}

