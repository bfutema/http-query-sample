/* eslint-disable class-methods-use-this */
export type IOrder = 'ASC' | 'DESC';

export const operators = {
  LIKE: 'LIKE',
  EQUAL: '=',
  NOT_EQUAL: '!=',
  LESS_THAN: '<',
  LESS_THAN_OR_EQUAL: '<=',
  GREATER_THAN: '>',
  GREATER_THAN_OR_EQUAL: '>=',
};

export type IOperator =
  | 'LIKE'
  | 'EQUAL'
  | 'NOT_EQUAL'
  | 'LESS_THAN'
  | 'LESS_THAN_OR_EQUAL'
  | 'GREATER_THAN'
  | 'GREATER_THAN_OR_EQUAL';

export type IRule = 'AND' | 'OR';

export interface ISort {
  order: IOrder;
  property: string;
}

export interface IFilter {
  property: string;
  value: string | number | Date;
  operator: IOperator;
  rule: IRule;
  entity: string;
}

export interface IQueryParams {
  q: string;
  page: string;
  limit: string;
  sort: string;
}

export interface IParsedQuery {
  q: IFilter[];
  page: number;
  limit: number;
  sort: ISort[];
}

export interface IQuery {
  getParsedQuery: (query: IQueryParams) => IParsedQuery;
}

class HttpQuery implements IQuery {
  private getParsedLimit(limit: string): number {
    if (limit.length === 0) return 100;

    return Number(limit);
  }

  private getParsedPage(page: string): number {
    if (Number(page) === 0) return 0;

    return Number(page) - 1;
  }

  private getParsedOrder(order: string): ISort[] {
    if (order.length === 0) return [];

    const splittedValues = order.split(',');

    const orders: ISort[] = splittedValues.map((sort) => {
      const formattedOrder = sort.split('(');

      return {
        order: formattedOrder[0].toUpperCase().trim() as IOrder,
        property: formattedOrder[1].slice(0, -1).toLowerCase().trim(),
      };
    });

    return orders;
  }

  private getParsedWhere(where: string): IFilter[] {
    if (where.length === 0) return [];

    const splittedRules = where.split(',');

    const filters: IFilter[] = splittedRules.map((item) => {
      const splittedOperators = item.split('(');

      const splittedValue = splittedOperators[2].split('=');
      const [entity, property] = splittedValue[0].split('.');

      return {
        property: property.toLowerCase().trim(),
        value: splittedValue[1].slice(0, -2).toLowerCase().trim(),
        rule: splittedOperators[0].toUpperCase().trim() as IRule,
        operator: splittedOperators[1].toUpperCase().trim() as IOperator,
        entity: entity.toLowerCase().trim(),
      };
    });

    return filters;
  }

  public getParsedQuery(query: IQueryParams): IParsedQuery {
    const parsedQuery: IParsedQuery = {
      q: this.getParsedWhere(query.q),
      page: this.getParsedPage(query.page),
      limit: this.getParsedLimit(query.limit),
      sort: this.getParsedOrder(query.sort),
    };

    return parsedQuery;
  }

  public getParsedQueryString(query?: IParsedQuery): string {
    if (!query) return '';

    const { q, page, limit, sort } = query;

    const formattedSort = sort.map((item) => {
      return `${item.order}(${item.property})`;
    });

    const formattedQuery = q.map((item) => {
      return `${item.rule}(${item.operator}(${item.entity}.${item.property}=${item.value}))`;
    });

    const pFilters = q ? `?q=${formattedQuery.join(',')}` : '';
    const pPage = page ? `&page=${page}` : '';
    const pLimit = limit ? `&limit=${limit}` : '';
    const pSort = sort.length > 0 ? `&sort=${formattedSort.join(',')}` : '';

    return `${pFilters}${pPage}${pLimit}${pSort}`;
  }

  public getInitialQuery({
    q,
    page,
    limit,
    sort,
  }: Partial<IParsedQuery>): IParsedQuery {
    const qFromURL = new URLSearchParams(window.location.search).get('q');
    const pageFromURL = new URLSearchParams(window.location.search).get('page');
    const limitFromURL = new URLSearchParams(window.location.search).get(
      'limit',
    );
    const sortFromURL = new URLSearchParams(window.location.search).get('sort');

    const queryFromURL = this.getParsedQuery({
      q: qFromURL || '',
      page: pageFromURL || '',
      limit: limitFromURL || '',
      sort: sortFromURL || '',
    });

    return {
      q: q || queryFromURL.q,
      page: page || queryFromURL.page,
      limit: limit || queryFromURL.limit,
      sort: sort || queryFromURL.sort,
    };
  }
}

const INSTANCE = new HttpQuery();

export { INSTANCE as HttpQuery };
