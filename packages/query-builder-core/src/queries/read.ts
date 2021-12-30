import { SQL_CONSTANTS } from "../constants";
import type { BaseQuery, QueryResponse, MiddlewareConfig  } from "../models"
import { GenericQueryBuilderReadCommand, GenericQueryBuilderWhere, GenericQueryBuilderDistinct, GenericQueryBuilderSelectColumn } from "generic-query-builder-common";

export class ReadQuery implements BaseQuery<GenericQueryBuilderReadCommand> {
  _collection: string;
  _command: GenericQueryBuilderReadCommand;
  _params: any[] = []
  _config: MiddlewareConfig
  constructor(collection: string, command: GenericQueryBuilderReadCommand, config: MiddlewareConfig) {
    this._collection = collection
    this._command = command
    this._config = config
  }

  toDistinctString () {
    let distinct: string[] = [];
    const items = this._command.Distinct || []
    items.forEach((x: any) => {
      let el = ''
      if (typeof(x) === 'object') {
        const item = x as GenericQueryBuilderDistinct
        el = `${item.Collection}.${item.Column}`
      } else {
        el = `${this._collection}.${x}`
      }
      distinct.push(`${SQL_CONSTANTS.DISTINCT} ${distinct.join(SQL_CONSTANTS.WHITE_SPACE)},`)
    })
    return distinct.join(SQL_CONSTANTS.WHITE_SPACE)
  }

  toJoinString () {
    const query: any[] = []
    const joins = this._command.Joins || []
    joins.forEach(x => {
      query.push(`${x.Type || SQL_CONSTANTS.INNER} ${SQL_CONSTANTS.JOIN} ${x.Collection} ${SQL_CONSTANTS.ON} ${x.Collection}.${x.PrimaryKey} ${SQL_CONSTANTS.EQUAL} ${this._collection}.${x.ParentKey}`)
    })
    return query.join(SQL_CONSTANTS.WHITE_SPACE)
  }

  handleWhere (startIndex: number, separator: string, where: GenericQueryBuilderWhere[] = []) {
    let query: any[] = []
    let index = startIndex
    where.forEach((x, i) => {
      index += i
      query.push(`${this._collection}.${x.Key} ${x.Operator} $${index}`)
      this._params.push(x.Value)
    })
    query = [query.length > 1 ? query.join(` ${separator} `) : query.join(' ')]
    return query.join(' ')
  }

  toWhereString () {
    const query: string[] = []
    const and = this.handleWhere(1, SQL_CONSTANTS.AND, this._command.Where)
    const or = this.handleWhere((this._command.Where || []).length + 1, SQL_CONSTANTS.OR, this._command.OrWhere)
    if (and) {
      query.push(`(${and})`)
    }
    if (or) {
      if (query.length > 0)
        query.push(SQL_CONSTANTS.OR)

      query.push(`(${or})`)
    }
    if (query.length > 0)
      query.unshift(SQL_CONSTANTS.WHERE)
    return query.join(SQL_CONSTANTS.WHITE_SPACE)
  }

  toColumnString () {
    const query: string [] = []

    const makeColumns = (items: string[] | GenericQueryBuilderSelectColumn[], collection: string) => {
      if (!Array.isArray(items) || items.length === 0) {
        query.push(`${collection}.*`)
        return
      }
      items.forEach(x => {
        if (typeof(x) === 'object') {
          query.push(`${collection}.${x.Column} as "${x.Alias}"`)
        }else {
          query.push(`${collection}.${x}`)
        }
      })
    }
    makeColumns(this._command.Columns || [], this._collection)

    const joins = this._command.Joins || []

    for (let index = 0; index < joins.length; index++) {
      const x = joins[index];
      const columns = (x.Columns || []).map(c => {
        if (typeof (c) !== 'object'){
          return {
            Alias: `${x.Collection}_${c}`,
            Column: c
          } as GenericQueryBuilderSelectColumn
        } 
        return c
      })
      makeColumns(columns, x.Collection)
    }
    
    return query.join(SQL_CONSTANTS.COMMA)
  }

  getLimit () {
    const limit = this._command.Limit || this._config.itemsPerRequest
    if (limit) {
      return `${SQL_CONSTANTS.LIMIT} ${limit}`
    }
    return SQL_CONSTANTS.WHITE_SPACE
  }

  toString (): string {
    const query: string[] = []
    query.push(SQL_CONSTANTS.SELECT)
    query.push(this.toDistinctString())
    query.push(`${this.toColumnString()}`)
    query.push(`${SQL_CONSTANTS.FROM} ${this._collection}`)
    query.push(this.toJoinString())
    query.push(this.toWhereString())

    const OrderBy = this._command.OrderBy || {}
    Object.keys(OrderBy)
      .forEach(x => {
        query.push(`${SQL_CONSTANTS.ORDER_BY} ${this._collection}.${x} ${OrderBy[x]}`)
      })
    
    query.push(this.getLimit())
    return query.join(SQL_CONSTANTS.WHITE_SPACE)
  }

  toQuery(): QueryResponse {
    return {
      query: this.toString(),
      parameters: this._params
    }
  }
  
}