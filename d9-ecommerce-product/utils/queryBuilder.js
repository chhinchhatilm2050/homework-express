import AppError from './appError.js';

class QueryBuilder {
  constructor(model, queryString) {
    this.model = model;
    this.queryString = queryString;
    this.query = model.find();
    this.page = 1;
    this.limit = 20;
  }

  filter() {
    const queryObj = {...this.queryString};
    const excludeFields = ['page', 'limit', 'sort', 'fields', 'search'];
    excludeFields.forEach(field => delete queryObj[field]);
    
    if(queryObj.featured !== undefined) {
      queryObj.featured = queryObj.featured === 'true';
    };

    this.query = this.query.find(queryObj);
    return this;
  };

  search() {
    if(this.queryString.search) {
      this.query = this.query.find({
        $text: {$search: this.queryString.search} 
      });
    }
    return this;
  };

  sort() {
    if(this.queryString.sort) {
      const sortBy = this.queryString.sort.split(',').join(' ');
      this.query = this.query.sort(sortBy);
    } else {
      this.query = this.query.sort('-createdAt');
    }
    return this;
  };

  limitFields() {
    if(this.queryString.fields) {
      const rawData = String(this.queryString.fields);
      if (!/^[-\w,]+$/.test(rawData)) {
        throw new AppError('Invalid fields parameter', 400);
      }
      const fields = rawData.split(',').join('');
      this.query = this.query.select(fields);
    } else {
      this.query = this.query.select('-__v');
    }
    return this;
  };

  paginate() {
    const skip = (this.queryString.page -1) * this.limit;
    this.page = this.queryString.page;
    this.limit = this.queryString.limit;
    this.query = this.query.skip(skip).limit(this.limit);
    return this;
  };
  async execute() {
    const [data, total] = await Promise.all([this.query, this.model.countDocuments(this.query)]);
    const totalPage = Math.ceil(total / this.limit);

    return {
      data,
      pagination: {
        total,
        page: this.page,
        limit: this.limit,
        totalPage,
        hastNextPage: this.page < totalPage,
        hasPrepage: this.page > 1
      }
    };
  }
};

export default QueryBuilder;