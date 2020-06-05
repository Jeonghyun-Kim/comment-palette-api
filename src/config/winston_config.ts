import * as winston from 'winston';
import * as moment from 'moment';

const { combine, label, printf } = winston.format;

// eslint-disable-next-line no-shadow
const myFormat = printf(({ level, message, label, timestamp }) => `${timestamp}[${label}] ${level}: ${message}`);

const appendTimestamp = winston.format((info, opts) => {
  const myInfo = info;
  if (opts.tz) {
    myInfo.timestamp = moment().tz(opts.tz).format();
  }
  return myInfo;
});

const options = {
  info_file: {
    level: 'info',
    filename: '../logs/info.log',
    handleExceptions: true,
    json: false,
    maxsize: 5242880,
    maxFiles: 5,
    colorize: false,
    format: combine(
      label({ label: 'WST' }),
      appendTimestamp({ tz: 'Asia/Seoul' }),
      myFormat,
    ),
  },

  error_file: {
    level: 'error',
    filename: '../logs/error.log',
    handleExceptions: true,
    json: false,
    maxsize: 5242880,
    maxFiles: 5,
    colorize: false,
    format: combine(
      label({ label: 'WST' }),
      appendTimestamp({ tz: 'Asis/Seoul' }),
      myFormat,
    ),
  },

  console: {
    level: 'debug',
    handleExceptions: true,
    json: false,
    colorize: true,
    timestamp: () => moment().format('YYYY-MM-DD HH:MM:ss'),
    format: combine(
      label({ label: 'WINSTON' }),
      appendTimestamp({ tz: 'Asis/Seoul' }),
      myFormat,
    ),
  },
};
const logger = process.env.NODE_ENV === 'production'
  ? winston.createLogger({
    transports: [
      new winston.transports.File(options.info_file),
      new winston.transports.File(options.error_file),
    ],
    exitOnError: false,
  })
  : winston.createLogger({
    transports: [new winston.transports.Console(options.console)],
  });

export default logger;
