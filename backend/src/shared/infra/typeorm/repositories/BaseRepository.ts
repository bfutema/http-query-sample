/* eslint-disable @typescript-eslint/no-explicit-any */
import { DeepPartial, Repository, SelectQueryBuilder, In } from 'typeorm';

import { operators } from '../../../helpers/HttpQueryHelper';

import {
  IBaseRepository,
  IFind,
  IFindById,
  IFindByIds,
} from './IBaseRepository';

class BaseRepository<Entity> implements IBaseRepository<Entity> {
  protected orm: Repository<Entity>;

  constructor(orm: Repository<Entity>) {
    this.orm = orm;
  }

  private getAlias(entity: string): string {
    const { targetName } = this.orm.metadata;

    const parsedEntity = entity.replace(/\w{1}/, (match) =>
      match.toUpperCase(),
    );

    if (parsedEntity === targetName) return parsedEntity;

    return `${targetName}__${entity}`;
  }

  private bind({ query, relations }: IFind) {
    const order = {};

    query.sort.forEach((item) => {
      order[item.property] = item.order;
    });

    const rules = {
      AND: (qb: SelectQueryBuilder<Entity>, whereQuery: string) => {
        qb.andWhere(whereQuery);
      },
      OR: (qb: SelectQueryBuilder<Entity>, whereQuery: string) => {
        qb.orWhere(whereQuery);
      },
    };

    const where = (qb: SelectQueryBuilder<Entity>) => {
      query.q.forEach((item) => {
        const parsedEntity = this.getAlias(item.entity);
        const property = `${parsedEntity}.${item.property}`;
        const operator = operators[item.operator];
        const value =
          item.operator === 'LIKE' ? `'%${item.value}%'` : `'${item.value}'`;

        rules[item.rule](qb, `${property} ${operator} ${value}`);
      });
    };

    return {
      relations,
      take: query.limit,
      skip: (query.page - 1) * query.limit,
      order,
      where,
    };
  }

  public async create(data: DeepPartial<Entity>): Promise<Entity> {
    const entity = this.orm.create(data);

    await this.orm.save<DeepPartial<Entity>>(entity as any);

    return entity;
  }

  public async save(entity: Entity): Promise<Entity> {
    await this.orm.save(entity as any);

    return entity;
  }

  public async find({
    query,
    relations = [],
  }: IFind): Promise<[Entity[], number]> {
    const total = await this.orm.count(this.bind({ query, relations }));

    const entities = await this.orm.find(this.bind({ query, relations }));

    return [entities, total];
  }

  public async findById({ id, relations = [] }: IFindById): Promise<Entity> {
    const entity = await this.orm.findOne(id, { relations });

    return entity;
  }

  public async findByIds({ ids, relations }: IFindByIds): Promise<Entity[]> {
    const entities = await this.orm.find({
      where: { id: In(ids) },
      relations,
    });

    return entities;
  }

  public async delete(id: number): Promise<void> {
    await this.orm.softDelete(id);
  }
}

export { BaseRepository };
