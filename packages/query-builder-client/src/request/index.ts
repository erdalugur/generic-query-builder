import { GenericQueryBuilderReadCommand, GenericQueryBuilderCreateCommand, GenericQueryBuilderDeleteCommand, GenericQueryBuilderUpdateCommand } from 'generic-query-builder-common'
import fetch from 'isomorphic-fetch'

const headers: any = {
  'content-type': 'application/json; charset=utf-8',
}

function createFetcher <T>(endpoint: string, params: any = {}) {
  return fetch(endpoint, {
    headers: headers,
    method: 'POST',
    body: JSON.stringify(params)
  }).then(x => x.json() as Promise<T>)
}

export class Request {
  private readonly _endpoint: string
  
  constructor (endpoint: string) {
    this._endpoint = endpoint;
  }

  Create <T>(collection: string, params: GenericQueryBuilderCreateCommand) {
    return createFetcher<T>(`${this._endpoint}/create/${collection}`, params)
  }
  
  Read <T>(collection: string, params?: Partial<GenericQueryBuilderReadCommand>) {
    return createFetcher<T>(`${this._endpoint}/read/${collection}`, params) 
  }

  Update <T>(collection: string, params: GenericQueryBuilderUpdateCommand) {
    return createFetcher<T>(`${this._endpoint}/update/${collection}`, params)
  }

  Upsert <T>(collection: string, params: GenericQueryBuilderUpdateCommand) {
    return createFetcher<T>(`${this._endpoint}/upsert/${collection}`, params) 
  }

  Delete <T>(collection: string, params: GenericQueryBuilderDeleteCommand) {
    return createFetcher<T>(`${this._endpoint}/delete/${collection}`, params) 
  }
}