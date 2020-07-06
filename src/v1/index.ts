import * as express from 'express';
import * as path from 'path';
import { Request, Response, NextFunction, Router } from 'express';
import * as sha256 from 'sha256';
import * as multer from 'multer';
import { uuid } from 'uuidv4';

import { Comment } from '../models/Comment';
import { Contact } from '../models/Contact';
import { Subscription } from '../models/Subscription';
import { Signature } from '../models/Signature';
import sendEmail from './mailer';
import logger from '../config/winston_config';

const uploadLocal = multer({
  storage: multer.diskStorage({
    destination: (_req, _file, cb) => {
      cb(null, './public/signatures/');
    },
    filename: (_req, file, cb) => {
      cb(null, uuid() + path.extname(file.originalname));
    },
  }),
});
const router: Router = express.Router();
const version: string = '1.0.3';

interface MailContent {
  index: number;
  name: string;
  email: string;
  phone?: number;
  content: string;
  subscription: boolean;
}

router.get('/', (_req: Request, res: Response) => res.status(200).json({ version }));

router.get('/comments', async (_req: Request, res: Response, next: NextFunction) => {
  try {
    const comments = await Comment.findAll({ order: [['createdAt', 'DESC']] });

    return res.status(200).json({ comments, error: 0 });
  } catch (err) {
    return next(err);
  }
});

router.post('/comment', async (req: Request, res: Response, next: NextFunction) => {
  const { name, password, content } = req.body;

  if (!name || !password || !content) {
    return res.status(400).json({ error: 400 });
  }

  try {
    await Comment.create({ name, password: sha256(password), content });

    logger.info(`[COMMENT CREATED] name: ${name}, content: ${content}`);
    return res.status(201).json({ error: 0 });
  } catch (err) {
    return next(err);
  }
});

router.put('/comment', async (req: Request, res: Response, next: NextFunction) => {
  const { id, name, content, password } = req.body;

  if (!id || !name || !content || !password) {
    return res.status(400).json({ error: 400 });
  }

  try {
    const comment = await Comment.scope('withPassword').findOne({ where: { id } });
    if (!comment) {
      return res.status(400).json({ error: 1 });
    }
    if (sha256(password) !== comment.password) {
      return res.status(401).json({ error: 401 });
    }
    await comment.update({ name, content });

    logger.info(`[COMMENT EDITED] id: ${id}, name: ${name}, content: ${content}`);
    return res.status(200).json({ name: comment.name, content: comment.content, error: 0 });
  } catch (err) {
    return next(err);
  }
});

router.delete('/comment', async (req: Request, res: Response, next: NextFunction) => {
  const { id, password } = req.body;

  if (!id || !password) {
    return res.status(400).json({ error: 400 });
  }

  try {
    const comment = await Comment.scope('withPassword').findOne({ where: { id } });
    if (!comment) {
      return res.status(400).json({ error: 1 });
    }
    if (sha256(password) !== comment.password) {
      return res.status(401).json({ error: 401 });
    }
    const { name, content } = comment;
    await comment.destroy();

    logger.info(`[COMMENT DELETED] id: ${id}, name: ${name}, content: ${content}`);
    return res.status(200).json({ error: 0 });
  } catch (err) {
    return next(err);
  }
});

router.post('/subscription', async (req: Request, res: Response, next: NextFunction) => {
  const { email } = req.body;

  try {
    const subscription = await Subscription.create({ email });

    logger.info(`[NEW SUBSCRIPTION] email: ${email}`);
    return res.status(201).json({ email: subscription.email, error: 0 });
  } catch (err) {
    return next(err);
  }
});

router.get('/subscriptions', async (_req: Request, res: Response, next: NextFunction) => {
  try {
    const subscriptions = await Subscription.findAll();

    return res.status(200).json({ count: subscriptions.length, error: 0 });
  } catch (err) {
    return next(err);
  }
});

router.delete('/subscription', async (req: Request, res: Response, next: NextFunction) => {
  const { email } = req.body;
  try {
    const subscription = await Subscription.findOne({ where: { email } });

    if (!subscription) {
      return res.status(400).json({ error: 400 });
    }

    await subscription.destroy();

    logger.info(`[SUBSCRIPTION DELETED] email: ${email}`);
    return res.status(200).json({ error: 0 });
  } catch (err) {
    return next(err);
  }
});

router.post('/contact', async (req: Request, res: Response, next: NextFunction) => {
  const { index, name, email, phone, content, subscription = false } = req.body;
  if (!index || !name || !email || !content) {
    return res.status(400).json({ error: 1 });
  }

  try {
    await Contact.create({ index, name, email, phone, content });

    if (subscription) {
      const exEmail = await Subscription.findOne({ where: { email } });
      if (!exEmail) {
        await Subscription.create({ email });
      }
    }

    logger.info(`[CONTACT CREATED] index: ${index}, name: ${name}, email: ${email}`);

    sendEmail(email, { index, name, email, phone, content, subscription } as MailContent);

    return res.status(201).json({ error: 0 });
  } catch (err) {
    return next(err);
  }
});

router.get('/contacts', async (_req: Request, res: Response, next: NextFunction) => {
  try {
    const contacts = await Contact.findAll();

    return res.status(200).json({ contacts, error: 0 });
  } catch (err) {
    return next(err);
  }
});

router.get('/signatures', async (_req: Request, res: Response, next: NextFunction) => {
  try {
    const signatures = await Signature.findAll({ order: [['createdAt', 'DESC']] });

    return res.status(200).json({ signatures, error: 0 });
  } catch (err) {
    return next(err);
  }
});

router.post('/signature', uploadLocal.single('signature'), async (req: Request, res: Response, next: NextFunction) => {
  const { content } = req.body;
  try {
    const signature = await Signature.create({ url: req.file.filename, content });

    return res.status(201).json({ signature, error: 0 });
  } catch (err) {
    return next(err);
  }
});

export default router;
