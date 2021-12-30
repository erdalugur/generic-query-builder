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

  Create <T>(collection: string, params?: Partial<GenericQueryBuilderCreateCommand>): Promise<T> {
    return createFetcher<T>(`${this._endpoint}/create/${collection}`, params)
  }
  
  Read <T>(collection: string, params?: Partial<GenericQueryBuilderReadCommand>): Promise<T> {
    return createFetcher<T>(`${this._endpoint}/read/${collection}`, params) 
  }

  Update <T>(collection: string, params?: Partial<GenericQueryBuilderUpdateCommand>): Promise<T> {
    return createFetcher<T>(`${this._endpoint}/update/${collection}`, params)
  }

  Upsert <T>(collection: string, params?: Partial<GenericQueryBuilderUpdateCommand>): Promise<T> {
    return createFetcher<T>(`${this._endpoint}/upsert/${collection}`, params) 
  }

  Delete <T>(collection: string, params?: Partial<GenericQueryBuilderDeleteCommand>): Promise<T> {
    return createFetcher<T>(`${this._endpoint}/delete/${collection}`, params) 
  }
}

export function createInstance (endpoint: string) {
  return new Request(endpoint)
}