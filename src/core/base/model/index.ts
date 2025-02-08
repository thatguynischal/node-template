import { Document } from 'mongoose';

export interface BaseDocument extends Document {
  id: string;
  createdAt: Date;
  updatedAt: Date;
  deletedAt: Date | null;
}

export interface BaseModelFields {
  id: string;
  createdAt: Date;
  updatedAt: Date;
  deletedAt?: Date | null;
}

export type CreateBaseDto = Omit<BaseModelFields, 'id' | 'createdAt' | 'updatedAt' | 'deletedAt'>;