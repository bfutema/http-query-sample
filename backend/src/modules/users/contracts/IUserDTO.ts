import { IQuery } from '@stackfy/http-query';

import {
  NonFunctionProperties,
  ObjectPropertyNames,
  PrimitiveProperties,
} from '../../../shared/contracts/IGeneric';

import { User } from '../app/typeorm/entities/User';

/**
 * Model: User
 */
export type IUser = NonFunctionProperties<User>;

/**
 * Method: POST
 * Create User
 */
export type ICreateUser = PrimitiveProperties<
  Omit<IUser, 'id' | 'created_at' | 'updated_at' | 'deleted_at'>
>;

/**
 * Method: GET
 * LIST User
 */
export type IListUser = {
  query?: IQuery;
  relations?: ObjectPropertyNames<IUser>[] | string[];
};

/**
 * Method: GET
 * SHOW User
 */
export type IShowUser = Pick<IUser, 'id'> & {
  relations?: ObjectPropertyNames<IUser>[] | string[];
};

/**
 * Method: PUT
 * Update User
 */
export type IUpdateUser = ICreateUser & { id: number };

/**
 * Method: PATCH
 * Update User
 */
export type IPartialUpdateUser = Partial<IUpdateUser>;

/**
 * DELETE User
 */
export type IDeleteUser = Pick<IUpdateUser, 'id'>;
