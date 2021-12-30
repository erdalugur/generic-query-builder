import { CreateQuery } from './create'
import { UpdateQuery } from './update'
import { DeleteQuery } from './delete'
import { ReadQuery } from './read'
import { UpsertQuery } from './upsert'

export type QueryType = (req: any, res: any, next: any, collection: string) => { toQuery(): { query: string, parameters: any[]}}

export const queryMap: { [key: string]: any} = {
  read: ReadQuery,
  create: CreateQuery,
  update: UpdateQuery,
  delete: DeleteQuery,
  upsert: UpsertQuery
}