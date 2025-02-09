import { FilterQuery, Model, QueryOptions, UpdateQuery } from 'mongoose';
import { BaseDocument, BaseModelFields } from '../model';

export abstract class BaseRepository<
  TDocument extends BaseDocument,
  TModel extends BaseModelFields,
  TCreateDto extends Record<string, any>
> {
  constructor(protected readonly model: Model<TDocument>) {}

  async findAll(
    query: FilterQuery<TDocument> = {},
    options: QueryOptions = {},
    includeDeleted = false
  ): Promise<TModel[]> {
    const effectiveQuery = includeDeleted
      ? query
      : { ...query, deletedAt: null };
    const docs = await this.model.find(effectiveQuery, null, options).exec();
    return docs.map(doc => doc.toJSON() as TModel);
  }

  async findOne(
    query: FilterQuery<TDocument>,
    options: QueryOptions = {},
    includeDeleted = false
  ): Promise<TModel | null> {
    const effectiveQuery = includeDeleted
      ? query
      : { ...query, deletedAt: null };
    const doc = await this.model.findOne(effectiveQuery, null, options).exec();
    return doc ? (doc.toJSON() as TModel) : null;
  }

  async findById(id: string): Promise<TModel | null> {
    const doc = await this.model.findById(id).exec();
    return doc ? (doc.toJSON() as TModel) : null;
  }

  async create(input: TCreateDto): Promise<TModel> {
    const doc = await new this.model(input).save();
    return  doc.toJSON() as TModel;
  }

  async update(
    query: FilterQuery<TDocument>,
    update: UpdateQuery<TDocument>,
    options: QueryOptions = { new: true },
    includeDeleted = false
  ): Promise<TModel | null> {
    const effectiveQuery = includeDeleted
      ? query
      : { ...query, deletedAt: null };
    const doc = await this.model.findOneAndUpdate(
      effectiveQuery,
      update,
      options
    ).exec();
    return doc ? (doc.toJSON() as TModel) : null;
  }

  async delete(
    id: string,
    options: QueryOptions = {},
    softDelete = true
  ): Promise<void> {
    if (softDelete) {
      await this.model.findByIdAndUpdate(
        id,
        { deletedAt: new Date() },
        options
      ).exec();
    } else {
      await this.model.findByIdAndDelete(id, options).exec();
    }
  }
}