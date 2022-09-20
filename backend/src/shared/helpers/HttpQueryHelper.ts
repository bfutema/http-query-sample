const operators = {
  LIKE: 'LIKE',
  EQUAL: '=',
  NOT_EQUAL: '!=',
  LESS_THAN: '<',
  LESS_THAN_OR_EQUAL: '<=',
  GREATER_THAN: '>',
  GREATER_THAN_OR_EQUAL: '>=',
};

type IParsedQs = {
  [key: string]: undefined | string | string[] | IParsedQs | IParsedQs[];
};

type IRule = 'AND' | 'OR';

type IOperator =
  | 'LIKE'
  | 'EQUAL'
  | 'NOT_EQUAL'
  | 'LESS_THAN'
  | 'LESS_THAN_OR_EQUAL'
  | 'GREATER_THAN'
  | 'GREATER_THAN_OR_EQUAL';

type IValue = string | number | boolean | Date;

type IFilter = {
  entity: string;
  property: string;
  rule: IRule;
  operator: IOperator;
  value: IValue;
};

type IOrder = 'ASC' | 'DESC';

type ISort = { order: IOrder; property: string };

type IQuery = { q: IFilter[]; page: number; limit: number; sort: ISort[] };

interface IHttpQuery {
  getParsedQuery: (query: IParsedQs) => IQuery;
}

class HttpQuery implements IHttpQuery {
  public getParsedQuery(query: IParsedQs): IQuery {
    if (Object.keys(query).length === 0) {
      const defaultParsedQuery: IQuery = {
        q: [],
        page: 1,
        limit: 100,
        sort: [],
      };

      return defaultParsedQuery;
    }

    return {
      q: this.getParsedFilters(query.q as string),
      page: this.getParsedPage(query.page as string),
      limit: this.getParsedLimit(query.limit as string),
      sort: this.getParsedSort(query.sort as string),
    };
  }

  private getParsedFilters(q: string): IFilter[] {
    if (!q) return [];

    if (q.length === 0) return [];

    const splittedRules = q.split(',');

    const filters: IFilter[] = splittedRules.map((rule) => {
      const splittedOperators = rule.split('(');

      const splittedValue = splittedOperators[2].split('=');
      const [entity, property] = splittedValue[0].split('.');

      return {
        entity: entity.toLowerCase().trim(),
        property: property.toLowerCase().trim(),
        rule: splittedOperators[0].toUpperCase().trim() as IRule,
        operator: splittedOperators[1].toUpperCase().trim() as IOperator,
        value: splittedValue[1].slice(0, -2).toLowerCase().trim(),
      };
    });

    return filters;
  }

  private getParsedPage(page: string): number {
    if (page?.length === 0) return 1;

    return Number(page);
  }

  private getParsedLimit(limit: string): number {
    if (limit?.length === 0) return 100;

    return Number(limit);
  }

  private getParsedSort(sort: string): ISort[] {
    if (!sort) return [];

    if (sort.length === 0) return [];

    const splittedRules = sort.split(',');

    const orders: ISort[] = splittedRules.map((item) => {
      const [order, property] = item.split('(');

      return {
        order: order.toUpperCase().trim() as IOrder,
        property: property.slice(0, -1).toLowerCase().trim(),
      };
    });

    return orders;
  }
}

const INSTANCE = new HttpQuery();

export { IQuery, INSTANCE as HttpQuery, operators };
