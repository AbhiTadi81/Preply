import { Router } from 'express';
import { reportController } from '../controllers/reportController';

const router = Router();

router.get('/today', reportController.getTodayReport);
router.get('/history', reportController.getHistory);

export default router;
