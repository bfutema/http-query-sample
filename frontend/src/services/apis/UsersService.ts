/* eslint-disable class-methods-use-this */

import { HttpQuery, IParsedQuery } from '../../helpers/HttpQueryHelper';
import { api } from '../api';

type IUser = {
  id: number;
  name: string;
  email: string;
  created_at: Date;
  updated_at: Date;
};

interface IListProps {
  query?: IParsedQuery;
  relations?: string[];
}

interface IListResponse {
  page: number;
  limit: number;
  total: number;
  data: IUser[];
}

class UsersService {
  public async list(params: IListProps): Promise<IListResponse> {
    const parsedQuery = HttpQuery.getParsedQueryString(params.query);

    const options = params.relations
      ? { headers: { relations: params.relations.join(',') } }
      : undefined;

    const { data } = await api.get<IListResponse>(
      `/users${parsedQuery}`,
      options,
    );

    return data;
  }
}

const INSTANCE = new UsersService();

export { INSTANCE as UsersService };
