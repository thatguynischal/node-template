import { Router } from 'express';
import { SubscriptionController } from '../controllers';
import { createSubscriptionSchema } from '../validators';
import { validate } from '../../../common/shared';

const router = Router();
const controller = new SubscriptionController();

// Create a new subscription
router.post('/', validate(createSubscriptionSchema), (req, res) => controller.createSubscription(req, res));

// Remove a subscription
router.delete('/:id', (req, res) => controller.removeSubscription(req, res));

// Get user's subscriptions
router.get('/user/:userId', (req, res) => controller.getUserSubscriptions(req, res));

export default router;
