import * as express from 'express';
import { Application, Request, Response, NextFunction } from 'express';
import * as bodyParser from 'body-parser';
import * as morgan from 'morgan';
import * as cors from 'cors';
import * as helmet from 'helmet';
import 'dotenv/config';

import logger from './config/winston_config';
import { sequelize } from './sequelize';
import indexRouter from './v1/index';

const CUSTOM: string = ':remote-addr - :remote-user ":method :url HTTP/:http-version" :status :res[content-length] ":referrer" ":user-agent"';

interface Err extends Error {
  status: number;
}
const app: Application = express();

sequelize.sync();
// sequelize.sync({ force: true });

app.set('port', process.env.PORT || 8081);

app.use(cors());
app.use(helmet());

if (process.env.NODE_ENV === 'production') {
  app.use(morgan(CUSTOM, { stream: { write: (message: string) => logger.info(message) } }));
} else {
  app.use(morgan('dev'));
}

app.use(bodyParser.json());

app.use('/', indexRouter);

app.all('*', (_req: Request, _res: Response, next: NextFunction) => {
  const error = new Error('404 NOT FOUND') as Err;
  error.status = 404;

  return next(error);
});

// eslint-disable-next-line @typescript-eslint/no-unused-vars
app.use((err: Err, _req: Request, res: Response, _next: NextFunction) => {
  if (err.name === 'SequelizeValidationError') {
    return res.status(400).json({ error: 400 });
  }

  if (process.env.NODE_ENV === 'production') {
    return res.status(err.status || 500).json({ errName: err.name || 'InternalServerError' });
  }

  return res.status(err.status || 500)
    .json({ errName: err.name, errMsg: err.message, errStack: err.stack });
});

app.listen(app.get('port'), () => {
  logger.info(`SERVER LISTIENING ON PORT ${app.get('port')}`);
});
