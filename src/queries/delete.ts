import { SQL_CONSTANTS } from "../constants";
import { BaseQuery, QueryResponse, GenericQueryBuilderDeleteCommand, GenericQueryBuilderWhere, MiddlewareConfig } from "../models";

export class DeleteQuery implements BaseQuery<GenericQueryBuilderDeleteCommand> {
  _collection: string;
  _command: GenericQueryBuilderDeleteCommand;
  _params: Record<string, any>[] = []
  _config: MiddlewareConfig
  
  constructor(collection: string, command: GenericQueryBuilderDeleteCommand,config: MiddlewareConfig) {
    this._collection = collection;
    this._command = command
    this._config = config
  }

  toWhereString (where: GenericQueryBuilderWhere[] = []) {
    const query: string[] = []
    
    where
      .forEach((x, i) => {
        this._params.push(x.Value)
        query.push(`${x.Key} ${x.Operator} $${i + 1}`)
      })
    return query.join(' or ')
  }

  toString () {
    const query: string[] = []
    query.push(`${SQL_CONSTANTS.DELETE} ${SQL_CONSTANTS.FROM} ${this._collection}`)
    const where = this._command.Where || []
    if (where.length > 0) {
      query.push(SQL_CONSTANTS.WHERE)
      query.push(this.toWhereString(where))
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