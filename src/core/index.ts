import { Pool, PoolConfig } from 'pg'
let _pool: Pool

export function getInstance (config: PoolConfig | undefined) {
  if (_pool) {
    return _pool
  }
  _pool = new Pool(config)
  return _pool
}

export async function executeQuery (config: any, query: string, parameters: any[]): Promise<any[]> {
  const instance = getInstance(config)
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
            return resolve(result.rows)
          }
        })
      }
    })
  })
}