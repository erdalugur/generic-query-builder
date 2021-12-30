import { NextFunction, Response } from 'express'
import { executeQuery } from './core'
import { MiddlewareConfig } from './models'
import { queryMap } from './queries'

export function useQueryMiddleware (params: MiddlewareConfig) {
  params.dbConfig.ssl = typeof(params.dbConfig.ssl) !== 'undefined' ? params.dbConfig.ssl : false
  return async (req: any, res: Response, next: NextFunction) => {
    const { action, collection } = req.params as { collection: string, action: string }
    if (!queryMap[action]) {
      params.onError({ message: `action does not supported. currently supported actions here: ${Object.keys(queryMap).join(',')}`  }, req, res, next)
      return
    }

    const fn = new queryMap[action](collection, req.body, params)
    
    const { query, parameters } = await fn.toQuery() as { query: string, parameters: Record<string, any>[]}
    
    executeQuery(params.dbConfig, query, parameters).then(data => {
      params.onSuccess({ rows: data, query }, req, res, next)
    }).catch(er => {
      params.onError({ message: er.message },req, res, next)
    })
  }
}
