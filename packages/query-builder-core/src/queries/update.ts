import { SQL_CONSTANTS } from "../constants";
import { BaseQuery, MiddlewareConfig, QueryResponse } from "../models";
import { GenericQueryBuilderUpdateCommand } from "generic-query-builder-common";

export class UpdateQuery implements BaseQuery<GenericQueryBuilderUpdateCommand> {
  _collection: string;
  _command: GenericQueryBuilderUpdateCommand;
  _params: any[] = []
  _config: MiddlewareConfig
  constructor(collection: string, command: GenericQueryBuilderUpdateCommand, config: MiddlewareConfig) {
    this._collection = collection;
    this._command = command
    this._config = config
  }

  toString () {
    const query: string[] = []
    query.push(`${SQL_CONSTANTS.UPDATE} ${this._collection}`)
    query.push(SQL_CONSTANTS.SET)

    const record = this._command.Record || {}
    let index: number = 0
    Object.keys(record)
      .forEach((x, i, arr) => {
        index = i + 1
        query.push(`"${x}" ${SQL_CONSTANTS.EQUAL} $${index} ${arr.length - 1 === i ? SQL_CONSTANTS.WHITE_SPACE : SQL_CONSTANTS.COMMA}`)
        this._params.push(record[x])
      })
    const where = this._command.Where || []
    if (where.length > 0) {
      query.push(SQL_CONSTANTS.WHERE)
      where.forEach((x, i) => {
        index += i + 1
        query.push(`${x.Key} ${x.Operator} $${index}`)
        this._params.push(x.Value)
      })
    }
    return query.join(SQL_CONSTANTS.WHITE_SPACE)
  }

  toQuery(): QueryResponse {
    return {
      query: this.toString(),
      parameters: this._params
    }
  }
}