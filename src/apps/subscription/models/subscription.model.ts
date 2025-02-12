import mongoose from 'mongoose';
import { BaseDocument, BaseModelFields } from '../../../core/base';
import { EventType, Subscription as SubscriptionType } from '../types';

export interface Subscription extends BaseModelFields {
  userId: string;
  eventType: EventType;
}

export interface ISubscriptionDocument extends BaseDocument, Omit<Subscription, 'id'> {
  deletedAt: Date | null;
}

const subscriptionSchema = new mongoose.Schema(
  {
    userId: {
      type: String,
      required: true,
      index: true,
    },
    eventType: {
      type: String,
      enum: Object.values(EventType),
      required: true,
    },
    deletedAt: {
      type: Date,
      default: null,
    }
  },
  {
    timestamps: true,
    toJSON: {
      transform: (_, ret) => {
        ret.id = ret._id;
        delete ret._id;
        delete ret.__v;
        delete ret.deletedAt;
        return ret;
      }
    }
  }
);

// Create compound index for userId and eventType to ensure unique subscriptions
subscriptionSchema.index({ userId: 1, eventType: 1, deletedAt: 1 }, { unique: true });

export const SubscriptionModel = mongoose.model<ISubscriptionDocument>('Subscription', subscriptionSchema);
