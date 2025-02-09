import { Request, Response } from 'express';
import { SubscriptionService } from '../services';
import { ApiResponse } from '../../../common/shared';

const subscriptionService = new SubscriptionService();

class SubscriptionController {
  async createSubscription(req: Request, res: Response): Promise<void> {
    const result = await subscriptionService.createSubscription(req.body);
    if (result.success) {
      ApiResponse.success(res, { success: true, document: result.data }, 201);
    } else {
      ApiResponse.error(res, { success: false, error: result.error! });
    }
  }

  async removeSubscription(req: Request, res: Response): Promise<void> {
    const result = await subscriptionService.removeSubscription(req.params.id);
    if (result.success) {
      res.status(204).send();
    } else {
      ApiResponse.error(res, { success: false, error: result.error! });
    }
  }

  async getUserSubscriptions(req: Request, res: Response): Promise<void> {
    const result = await subscriptionService.getUserSubscriptions(req.params.userId);
    if (result.success) {
      ApiResponse.success(res, { success: true, documents: result.data });
    } else {
      ApiResponse.error(res, { success: false, error: result.error! });
    }
  }

  async getSubscription(req: Request, res: Response): Promise<void> {
    const result = await subscriptionService.getSubscription(req.params.id);
    if (result.success) {
      ApiResponse.success(res, { success: true, document: result.data });
    } else {
      ApiResponse.error(res, { success: false, error: result.error! });
    }
  }

}

export default SubscriptionController;