import { FilterQuery, UpdateQuery, QueryOptions } from 'mongoose';
import { ISubscriptionDocument, SubscriptionModel } from '../models/subscription.model';
import { EventType, Subscription, CreateSubscriptionDto } from '../types';

export class SubscriptionRepository {
  async findAll(
    query: FilterQuery<ISubscriptionDocument> = {},
    options: QueryOptions = {},
    includeDeleted = false
  ): Promise<Subscription[]> {
    const effectiveQuery = includeDeleted
      ? query
      : { ...query, deletedAt: null };
    const docs = await SubscriptionModel.find(effectiveQuery, null, options).exec();
    return docs.map(doc => doc.toJSON() as Subscription);
  }

  async findOne(
    query: FilterQuery<ISubscriptionDocument>,
    options: QueryOptions = {},
    includeDeleted = false
  ): Promise<Subscription | null> {
    const effectiveQuery = includeDeleted
      ? query
      : { ...query, deletedAt: null };
    const doc = await SubscriptionModel.findOne(effectiveQuery, null, options).exec();
    return doc ? (doc.toJSON() as Subscription) : null;
  }

  async findById(id: string): Promise<Subscription | null> {
    const doc = await SubscriptionModel.findById(id).exec();
    return doc ? (doc.toJSON() as Subscription) : null;
  }

  async create(input: CreateSubscriptionDto): Promise<Subscription> {
    const doc = await new SubscriptionModel(input).save();
    return doc.toJSON() as unknown as Subscription;
  }

  async update(
    query: FilterQuery<ISubscriptionDocument>,
    update: UpdateQuery<ISubscriptionDocument>,
    options: QueryOptions = { new: true },
    includeDeleted = false
  ): Promise<Subscription | null> {
    const effectiveQuery = includeDeleted
      ? query
      : { ...query, deletedAt: null };
    const doc = await SubscriptionModel.findOneAndUpdate(
      effectiveQuery,
      update,
      options
    ).exec();
    return doc ? (doc.toJSON() as Subscription) : null;
  }

  async delete(
    id: string,
    options: QueryOptions = {},
    softDelete = true
  ): Promise<void> {
    if (softDelete) {
      await SubscriptionModel.findByIdAndUpdate(
        id,
        { $set: { deletedAt: new Date() } },
        options
      ).exec();
    } else {
      await SubscriptionModel.findByIdAndDelete(id, options).exec();
    }
  }

  // Subscription-specific methods
  async findByUserIdAndEventType(
    userId: string,
    eventType: EventType
  ): Promise<Subscription | null> {
    return await this.findOne({ userId, eventType });
  }

  async findByUserId(userId: string): Promise<Subscription[]> {
    return await this.findAll({ userId });
  }

  async findByEventType(eventType: EventType): Promise<Subscription[]> {
    return await this.findAll({ eventType });
  }

  async countDocuments(
    query: FilterQuery<ISubscriptionDocument> = {},
    includeDeleted = false
  ): Promise<number> {
    const effectiveQuery = includeDeleted
      ? query
      : { ...query, deletedAt: null };
    return await SubscriptionModel.countDocuments(effectiveQuery).exec();
  }
}