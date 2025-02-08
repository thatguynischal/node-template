import { Router } from 'express';
import { subscriptionRoutes } from '../../apps';
const router = Router();

router.use('/subscription', subscriptionRoutes);

export default router;
