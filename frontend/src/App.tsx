import React, { useCallback, useEffect, useState } from 'react';

import debounce from 'lodash/debounce';
import { v4 } from 'uuid';

import { HttpQuery, IParsedQuery } from './helpers/HttpQueryHelper';
import { UsersService } from './services/apis/UsersService';

type IUser = {
  id: number;
  name: string;
  email: string;
  created_at: Date;
  updated_at: Date;
};

const App: React.FC = () => {
  const [users, setUsers] = useState<IUser[]>([]);

  const [query, setQuery] = useState<IParsedQuery>(
    HttpQuery.getInitialQuery({
      limit: 100,
      sort: [{ order: 'ASC', property: 'name' }],
    }),
  );

  useEffect(() => {
    async function load() {
      const { data } = await UsersService.list({
        query,
        relations: [],
      });

      setUsers(data);

      const parsedQuery = HttpQuery.getParsedQueryString(query);

      window.history.pushState('', '', `/users${parsedQuery}`);
    }

    load();
  }, [query]);

  const handleSearch = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setQuery({
      q: [
        {
          rule: 'AND',
          operator: 'LIKE',
          entity: 'user',
          property: 'name',
          value: e.target.value,
        },
      ],
      page: 1,
      limit: 0,
      sort: [{ order: 'ASC', property: 'name' }],
    });
  }, []);

  return (
    <div>
      <input type="search" onChange={debounce(handleSearch, 500)} />

      {users.map((user) => {
        return (
          <div key={v4()}>
            <strong>{user.name}</strong> <span>{user.email}</span>
          </div>
        );
      })}
    </div>
  );
};

export { App };
