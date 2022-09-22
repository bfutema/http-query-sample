import { DeepPartial } from 'typeorm';

import { IQuery } from '@stackfy/http-query';

export type IFind = { query?: IQuery; relations?: string[] };
export type IFindById = { id: number; relations?: string[] };
export type IFindByIds = { ids: number[]; relations?: string[] };

export interface IBaseRepository<Entity> {
  create(data: DeepPartial<Entity>): Promise<Entity>;
  save(entity: Entity): Promise<Entity>;
  find(params: IFind): Promise<[Entity[], number]>;
  findById(params: IFindById): Promise<Entity>;
  findByIds(params: IFindByIds): Promise<Entity[]>;
  delete(id: number): Promise<void>;
}
