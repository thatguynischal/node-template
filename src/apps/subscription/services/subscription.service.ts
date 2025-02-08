import { CreateSubscriptionDto, Subscription, EventType } from '../types';
import { SubscriptionRepository } from '../repositories/subscription.repository';

export class SubscriptionService {
  private repository: SubscriptionRepository;

  constructor() {
    this.repository = new SubscriptionRepository();
  }

  async createSubscription(dto: CreateSubscriptionDto): Promise<Subscription> {
    // Check if subscription already exists
    const existing = await this.repository.findByUserIdAndEventType(dto.userId, dto.eventType);
    if (existing) {
      throw new Error(`Subscription already exists for user ${dto.userId} and event type ${dto.eventType}`);
    }
    
    return this.repository.create(dto);
  }

  async removeSubscription(id: string): Promise<void> {
    const subscription = await this.repository.findById(id);
    if (!subscription) {
      throw new Error(`Subscription with id ${id} not found`);
    }
    await this.repository.delete(id);
  }

  async getUserSubscriptions(userId: string): Promise<Subscription[]> {
    return this.repository.findByUserId(userId);
  }

  async getSubscription(id: string): Promise<Subscription> {
    const subscription = await this.repository.findById(id);
    if (!subscription) {
      throw new Error(`Subscription with id ${id} not found`);
    }
    return subscription;
  }

  async getSubscriptionsByEventType(eventType: EventType): Promise<Subscription[]> {
    return this.repository.findByEventType(eventType);
  }
}
