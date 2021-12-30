import { NextFunction, Request, Response } from 'express'
import { PoolConfig } from 'pg'

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

export type ErrorFn = (err: { message: string }, req: Request, res: Response, next: NextFunction) => void
export type SuccessFn = (result: { rows: any[], query: string}, req: Request, res: Response, next: NextFunction) => void
