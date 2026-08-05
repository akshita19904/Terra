import { Router } from 'express';
import { HealthController } from '../../../modules/health/HealthController';

const router = Router();
const healthController = new HealthController();

router.get('/health', (req, res) => healthController.executeImpl(req, res));

export { router as rootRouter };
