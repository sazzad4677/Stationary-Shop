import {  Query } from 'mongoose';
import { Product } from '../modules/products/products.model';

interface QueryParams {
  search?: string;
  filter?: string;
  sortBy?: string;
  page?: string;
  limit?: string;
}

class QueryBuilder<T> {
  public modelQuery: Query<T[], T>;
  public query: QueryParams
  public searchAbleFields: string[] = ['name', ];

  constructor(modelQuery: Query<T[], T>, query: QueryParams, searchAbleFields: string[] = []) {
    this.modelQuery = modelQuery;
    this.query = query;
    this.searchAbleFields = searchAbleFields
  }

  search() {
    const searchQuery = this.query.search;
    if (searchQuery) {
      const orConditions = this.searchAbleFields.map((field) => {
        if (field.includes('.')) {
          const [parentField, childField] = field.split('.');
          return { [`${parentField}.${childField}`]: { $regex: searchQuery, $options: 'i' } };
        }
        return { [field]: { $regex: searchQuery, $options: 'i' } };
      });

      this.modelQuery = this.modelQuery.find({
        $or: orConditions,
      });
    }
    return this;
  }

  filter() {
    const filterQuery: Record<string, unknown> = {};
    const { filter } = this.query;

    if (filter) {
      // Filter by price range (if minPrice and/or maxPrice are provided)
      if (typeof filter === 'object' && ('minPrice' in filter || 'maxPrice' in filter)) {
        const priceFilter: Record<string, number> = {};
        if ('minPrice' in filter) {
          priceFilter.$gte = Number(filter['minPrice']);
        }
        if ('maxPrice' in filter) {
          priceFilter.$lte = Number(filter['maxPrice']);
        }
        filterQuery.price = priceFilter;
      }

      // Filter by category (if provided)
      if (typeof filter === 'object' && 'category' in filter && filter['category'] !== 'all') {
        filterQuery.category = { $regex: new RegExp(filter['category'], 'i') };
      }
      if (typeof filter === 'object' && "inStock" in filter && filter["inStock"] === "true") {
        filterQuery.inStock = true;
      }
    }

    this.modelQuery = this.modelQuery.find(filterQuery);
    return this;
  }

  sort() {
    const sort = this.query.sortBy?.split(',').join(' ') || '-createdAt';
    this.modelQuery = this.modelQuery.sort(sort);
    return this;
  }


  paginate() {
    const page = Number(this?.query?.page) || 1;
    const limit = Number(this?.query?.limit) || 20;
    const skip = (page - 1) * limit;

    this.modelQuery = this.modelQuery.skip(skip).limit(limit);

    return this;
  }
  async countTotal() {
    const totalQueries = this.modelQuery.getFilter();
    const total = await this.modelQuery.model.countDocuments(totalQueries);
    const page = Number(this?.query?.page) || 1;
    const limit = Number(this?.query?.limit) || 10;
    const totalPage = Math.ceil(total / limit);
    const maxPrice = (await Product.find().select('price').sort({ price: -1 }).limit(1))[0]?.price;
    const minPrice = (await Product.find().select('price').sort({ price: 1 }).limit(1))[0]?.price;

    return {
      page,
      limit,
      total,
      totalPage,
      maxPrice,
      minPrice,
    };
  }
}

export default QueryBuilder;
