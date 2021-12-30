import { SQL_CONSTANTS } from "../constants";
import { QueryResponse, BaseQuery, GenericQueryBuilderCreateCommand, MiddlewareConfig } from "../models";

export class CreateQuery implements BaseQuery<GenericQueryBuilderCreateCommand> {
  _collection: string;
  _command: GenericQueryBuilderCreateCommand;
  _params: any [] = []
  _config: MiddlewareConfig
  constructor(collection: string, command: GenericQueryBuilderCreateCommand, config: MiddlewareConfig) {
    this._collection = collection;
    this._command = command
    this._config = config
  }

  toString () {
    const record = this._command.Record || []
    const query: string[] = []
    let index = 0
    query.push(`${SQL_CONSTANTS.INSERT_INTO} ${this._collection}`)
    query.push(`(${Object.keys(record[0]).map(x => `"${x}"`).join(SQL_CONSTANTS.COMMA)})`)
    query.push(SQL_CONSTANTS.VALUES)
    record.forEach((x, i, arr) => {
      const values: any[] = []
      Object.keys(x).forEach((key) => {
        index++
        this._params.push(x[key])
        values.push(`$${index}`)
      })
      query.push(`(${values.join(SQL_CONSTANTS.COMMA)}) ${arr.length === (i + 1) ? SQL_CONSTANTS.WHITE_SPACE : SQL_CONSTANTS.COMMA}`)
    })
    const columns = this._command.Select || []

    if (columns.length > 0) {
      query.push(SQL_CONSTANTS.RETURNING)
      query.push(columns.join(SQL_CONSTANTS.COMMA))
    }
    return `${query.join(SQL_CONSTANTS.WHITE_SPACE)}`
  }

  toQuery(): QueryResponse {
    return {
      query: this.toString(),
      parameters: this._params
    }
  }
  
}