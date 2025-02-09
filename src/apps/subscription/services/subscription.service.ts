import { CreateSubscriptionDto, Subscription, EventType } from '../types';
import { SubscriptionRepository } from '../repositories';
import { ErrorResponse } from '../../../common/shared';

type ServiceResponse<T> = {
  success: boolean;
  error?: ErrorResponse;
  data?: T;
};

class SubscriptionService {
  private repository: SubscriptionRepository;

  constructor() {
    this.repository = new SubscriptionRepository();
  }

  async createSubscription(dto: CreateSubscriptionDto): Promise<ServiceResponse<Subscription>> {
    try {
      if (!Object.values(EventType).includes(dto.eventType)) {
        throw new ErrorResponse('INVALID_EVENT_TYPE', 'Invalid event type', ['Please provide a valid event type']);
      }

      // Check if subscription already exists
      const existing = await this.repository.findByUserIdAndEventType(dto.userId, dto.eventType);
      if (existing) {
        throw new ErrorResponse(
          'SUBSCRIPTION_EXISTS',
          `Subscription already exists for user ${dto.userId} and event type ${dto.eventType}`,
          ['Try updating the existing subscription instead']
        );
      }

      const subscription = await this.repository.create(dto);
      return { success: true, data: subscription };
    } catch (error) {
      return {
        success: false,
        error: error instanceof ErrorResponse ? error : new ErrorResponse('DATABASE_ERROR', (error as Error).message),
      };
    }
  }

  async removeSubscription(id: string): Promise<ServiceResponse<void>> {
    try {
      const subscription = await this.repository.findById(id);
      if (!subscription) {
        throw new ErrorResponse(
          'SUBSCRIPTION_NOT_FOUND',
          `Subscription with id ${id} not found`,
          ['Check if the subscription ID is correct']
        );
      }
      await this.repository.delete(id);
      return { success: true };
    } catch (error) {
      return {
        success: false,
        error: error instanceof ErrorResponse ? error : new ErrorResponse('DATABASE_ERROR', (error as Error).message),
      };
    }
  }

  async getUserSubscriptions(userId: string): Promise<ServiceResponse<Subscription[]>> {
    try {
      const subscriptions = await this.repository.findAll({ userId });
      return { success: true, data: subscriptions };
    } catch (error) {
      return {
        success: false,
        error: error instanceof ErrorResponse ? error : new ErrorResponse('DATABASE_ERROR', (error as Error).message),
      };
    }
  }

  async getSubscription(id: string): Promise<ServiceResponse<Subscription>> {
    try {
      const subscription = await this.repository.findById(id);
      if (!subscription) {
        throw new ErrorResponse(
          'SUBSCRIPTION_NOT_FOUND',
          `Subscription with id ${id} not found`,
          ['Check if the subscription ID is correct']
        );
      }
      return { success: true, data: subscription };
    } catch (error) {
      return {
        success: false,
        error: error instanceof ErrorResponse ? error : new ErrorResponse('DATABASE_ERROR', (error as Error).message),
      };
    }
  }

  async getSubscriptionsByEventType(eventType: EventType): Promise<ServiceResponse<Subscription[]>> {
    try {
      if (!Object.values(EventType).includes(eventType)) {
        throw new ErrorResponse('INVALID_EVENT_TYPE', 'Invalid event type', ['Please provide a valid event type']);
      }
      const subscriptions = await this.repository.findByEventType(eventType);
      return { success: true, data: subscriptions };
    } catch (error) {
      return {
        success: false,
        error: error instanceof ErrorResponse ? error : new ErrorResponse('DATABASE_ERROR', (error as Error).message),
      };
    }
  }
}

export default SubscriptionService;