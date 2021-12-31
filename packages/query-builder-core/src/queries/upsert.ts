import { createQueryInstance } from "../core";
import { QueryResponse, MiddlewareConfig, GenericQueryBuilderResult } from "../models";
import { CreateQuery } from "./create";
import { ReadQuery } from "./read";
import { UpdateQuery } from "./update";

export class UpsertQuery {
  _collection: string;
  _command: any;
  _params: Record<string, any>[] = []
  _config: MiddlewareConfig
  _read: ReadQuery
  _update: UpdateQuery
  _create: CreateQuery
  private executeQuery: <T>(query: string, parameters: any[]) => Promise<GenericQueryBuilderResult<T>>
  constructor(collection: string, command: any,config: MiddlewareConfig) {
    this._collection = collection;
    this._command = command
    this._config = config
    this._read = new ReadQuery(collection,command, config)
    this._update = new UpdateQuery(collection,command, config)
    this._create = new CreateQuery(collection,command, config),
    this.executeQuery = createQueryInstance(this._config.dbConfig)
  }
  
  async toQuery(): Promise<QueryResponse> {
    const q = this._read.toQuery()
    const { rows } = await this.executeQuery<any>(q.query, q.parameters)
    if (rows.length) {
      return this._update.toQuery()
    }
    return this._create.toQuery()
  }
}