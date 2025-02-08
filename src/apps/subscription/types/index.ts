export enum EventType {
  PRICE_UPDATE = 'price_update',
  NEW_ARTICLE = 'new_article'
}

export interface Subscription {
  id: string;
  userId: string;
  eventType: EventType;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateSubscriptionDto {
  userId: string;
  eventType: EventType;
}

export interface SubscriptionResponse {
  id: string;
  userId: string;
  eventType: EventType;
  createdAt: string;
  updatedAt: string;
}
