import { Router } from 'express';
import { interviewController } from '../controllers/interviewController';

const router = Router();

router.post('/', interviewController.createSession);
router.get('/', interviewController.getAllSessions);
router.get('/:id', interviewController.getSession);
router.get('/:id/report', interviewController.getFinalReport);
router.post('/:id/answer', interviewController.submitAnswer);

export default router;

