import { NextFunction, Request, Response } from 'express'
import { PoolConfig, QueryResult } from 'pg'

export type QueryResponse = { query: string, parameters: any[]}

export type BaseQuery<T> = {
  _collection: string
  _command: T
  toQuery (): QueryResponse
}
export interface MiddlewareConfig {
  itemsPerRequest?: number
  dbConfig: PoolConfig
  onError: ErrorFn
  onSuccess: SuccessFn
}

export type ErrorFn = (err: GenericQueryBuilderErrorResult, req: Request, res: Response, next: NextFunction) => void
export type SuccessFn = (result: GenericQueryBuilderResult<any>, req: Request, res: Response, next: NextFunction) => void

export interface GenericQueryBuilderErrorResult {
  message: string
}
export interface GenericQueryBuilderResult<T> extends QueryResult<T> {
  query: string
}