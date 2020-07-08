import * as express from 'express';
import { Request, Response, NextFunction, Router } from 'express';
import { HitCount } from '../../models/HitCount';

// import logger from '../../config/winston_config';

const router: Router = express.Router();

interface HitCountInterface {
  intro: number;
  main1: number;
  main2: number;
  main3: number;
  main4: number;
  main5: number;
  video: number;
  menu: number;
  list: number;
  viewingRoom: number;
  history: number;
  guest: number;
}

const assignHitcount = (hitCount: HitCount) => {
  const {
    intro,
    main1,
    main2,
    main3,
    main4,
    main5,
    video,
    menu,
    list,
    viewingRoom,
    history,
    guest,
  } = hitCount;

  const result: HitCountInterface = {
    intro,
    main1,
    main2,
    main3,
    main4,
    main5,
    video,
    menu,
    list,
    viewingRoom,
    history,
    guest,
  };

  return result;
};

router.get('/', (_req: Request, res: Response) => res.status(200).json({ error: 0 }));

router.get('/main/:idx', async (req: Request, res: Response, next: NextFunction) => {
  const { idx } = req.params;
  try {
    let hitCount = await HitCount.findOne({
      order: [['id', 'DESC']],
    });

    if (!hitCount) {
      hitCount = await HitCount.create({});
    }

    const exHitCount = assignHitcount(hitCount);

    switch (Number(idx)) {
      case 0:
        hitCount = await HitCount.create({ ...exHitCount, intro: exHitCount.intro + 1 });
        break;
      case 1:
        hitCount = await HitCount.create({ ...exHitCount, main1: exHitCount.main1 + 1 });
        break;
      case 2:
        hitCount = await HitCount.create({ ...exHitCount, main2: exHitCount.main2 + 1 });
        break;
      case 3:
        hitCount = await HitCount.create({ ...exHitCount, main3: exHitCount.main3 + 1 });
        break;
      case 4:
        hitCount = await HitCount.create({ ...exHitCount, main4: exHitCount.main4 + 1 });
        break;
      case 5:
        hitCount = await HitCount.create({ ...exHitCount, main5: exHitCount.main5 + 1 });
        break;
      case 6:
        hitCount = await HitCount.create({ ...exHitCount, video: exHitCount.video + 1 });
        break;
      case 7:
        hitCount = await HitCount.create({ ...exHitCount, menu: exHitCount.menu + 1 });
        break;
      default:
        return res.status(400).json({ error: 400 });
    }

    return res.status(201).json({ hitCount, error: 0 });
  } catch (err) {
    return next(err);
  }
});

router.get('/list', async (req: Request, res: Response, next: NextFunction) => {
  try {
    let hitCount = await HitCount.findOne({
      order: [['id', 'DESC']],
    });

    if (!hitCount) {
      hitCount = await HitCount.create({});
    }

    const exHitCount = assignHitcount(hitCount);

    hitCount = await HitCount.create({ ...exHitCount, list: exHitCount.list + 1 });

    return res.status(201).json({ hitCount });
  } catch (err) {
    return next(err);
  }
});

router.get('/viewingRoom', async (req: Request, res: Response, next: NextFunction) => {
  try {
    let hitCount = await HitCount.findOne({
      order: [['id', 'DESC']],
    });

    if (!hitCount) {
      hitCount = await HitCount.create({});
    }

    const exHitCount = assignHitcount(hitCount);

    hitCount = await HitCount.create({ ...exHitCount, viewingRoom: exHitCount.viewingRoom + 1 });

    return res.status(201).json({ hitCount });
  } catch (err) {
    return next(err);
  }
});

router.get('/history', async (req: Request, res: Response, next: NextFunction) => {
  try {
    let hitCount = await HitCount.findOne({
      order: [['id', 'DESC']],
    });

    if (!hitCount) {
      hitCount = await HitCount.create({});
    }

    const exHitCount = assignHitcount(hitCount);

    hitCount = await HitCount.create({ ...exHitCount, history: exHitCount.history + 1 });

    return res.status(201).json({ hitCount });
  } catch (err) {
    return next(err);
  }
});

router.get('/guest', async (req: Request, res: Response, next: NextFunction) => {
  try {
    let hitCount = await HitCount.findOne({
      order: [['id', 'DESC']],
    });

    if (!hitCount) {
      hitCount = await HitCount.create({});
    }

    const exHitCount = assignHitcount(hitCount);

    hitCount = await HitCount.create({ ...exHitCount, guest: exHitCount.guest + 1 });

    return res.status(201).json({ hitCount });
  } catch (err) {
    return next(err);
  }
});

export default router;
