import { Pool, PoolConfig } from 'pg'
import { NextFunction, Response } from 'express'
import { MiddlewareConfig, BaseQuery, GenericQueryBuilderResult } from '../models'
import { queryMap } from '../queries'

let _pool: Pool

function getInstance (config: PoolConfig | undefined) {
  if (!_pool) {
    _pool = new Pool(config)
  }
  return _pool
}

export const createQueryInstance = (config: PoolConfig) => {
  const instance = getInstance(config)

  return async <T>(query: string, parameters: any []): Promise<GenericQueryBuilderResult<T>> => {
    return new Promise((resolve, reject) => {
      instance.connect((err: any, client, release) => {
        if (err) {
          reject(err) 
        } else {
          client.query(query, parameters, (err: any, result) => {
            release()
            if (err) {
              reject(err) 
            }else {
              return resolve({...result, query })
            }
          })
        }
      })
    })
  }
}


export function useQueryMiddleware (params: MiddlewareConfig) {
  params.dbConfig.ssl = typeof(params.dbConfig.ssl) !== 'undefined' ? params.dbConfig.ssl : false
  const executeQuery = createQueryInstance(params.dbConfig)
  return async (req: any, res: Response, next: NextFunction) => {
    const { action, collection } = req.params as { collection: string, action: string }
    if (!queryMap[action]) {
      params.onError({ message: `action does not supported. currently supported actions here: ${Object.keys(queryMap).join(',')}`  }, req, res, next)
      return
    }

    const fn = new queryMap[action](collection, req.body, params) as BaseQuery<unknown>
    
    const { query, parameters } = await fn.toQuery() 
    
    executeQuery<any>(query, parameters).then((result) => {
      params.onSuccess(result, req, res, next)
    }).catch(er => {
      params.onError({ message: er.message },req, res, next)
    })
  }
}