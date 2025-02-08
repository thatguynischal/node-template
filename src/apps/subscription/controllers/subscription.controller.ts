import { Request, Response } from 'express';
import { SubscriptionService } from '../services';
import { CreateSubscriptionDto, EventType } from '../types';

const subscriptionService = new SubscriptionService();

class SubscriptionController {
  async createSubscription(req: Request, res: Response): Promise<void> {
    try {
      const dto: CreateSubscriptionDto = {
        userId: req.body.userId,
        eventType: req.body.eventType
      };

      if (!Object.values(EventType).includes(dto.eventType)) {
        res.status(400).json({ message: 'Invalid event type' });
        return;
      }

      const subscription = await subscriptionService.createSubscription(dto);
      res.status(201).json(subscription);
    } catch (error) {
      if (error instanceof Error && error.message.includes('Subscription already exists')) {
        res.status(409).json({ message: error.message });
        return;
      }
      res.status(500).json({ message: 'Failed to create subscription' });
    }
  }

  async removeSubscription(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      await subscriptionService.removeSubscription(id);
      res.status(204).send();
    } catch (error) {
      res.status(404).json({ message: 'Subscription not found' });
    }
  }

  async getUserSubscriptions(req: Request, res: Response): Promise<void> {
    try {
      const { userId } = req.params;
      const subscriptions = await subscriptionService.getUserSubscriptions(userId);
      res.status(200).json(subscriptions);
    } catch (error) {
      res.status(500).json({ message: 'Failed to fetch subscriptions' });
    }
  }
}

export default SubscriptionController;