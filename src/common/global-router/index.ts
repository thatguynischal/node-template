import { Router } from 'express';
import { SubscriptionRoutes } from '../../apps/subscription';
const router = Router();

router.use('/subscription', SubscriptionRoutes);

export default router;
