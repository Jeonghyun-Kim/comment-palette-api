import * as express from 'express';
import { Request, Response, NextFunction, Router } from 'express';
import * as sha256 from 'sha256';

import { Comment } from '../models/Comment';
import { Subscription } from '../models/Subscription';
import logger from '../config/winston_config';

const router: Router = express.Router();
const version: string = '1.0.0';

router.get('/', (_req: Request, res: Response) => res.status(200).json({ version }));

router.get('/comments', async (_req: Request, res: Response, next: NextFunction) => {
  try {
    const comments = await Comment.findAll();

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

router.get('/subscriptions', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const subscriptions = await Subscription.findAll();

    return res.status(200).json({ subscriptions, error: 0 });
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

export default router;
