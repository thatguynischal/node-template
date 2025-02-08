import { BaseRepository } from '../../../core/base';
import { ISubscriptionDocument, SubscriptionModel } from '../models/subscription.model';
import { Subscription, CreateSubscriptionDto, EventType } from '../types';

class SubscriptionRepository extends BaseRepository<
  ISubscriptionDocument,
  Subscription,
  CreateSubscriptionDto
> {
  constructor() {
    super(SubscriptionModel);
  }

  async findByUserIdAndEventType(
    userId: string,
    eventType: EventType
  ): Promise<Subscription | null> {
    return this.findOne({ userId, eventType });
  }

  async findByEventType(eventType: EventType): Promise<Subscription[]> {
    return this.findAll({ eventType });
  }
}

export default SubscriptionRepository;