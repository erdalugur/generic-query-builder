declare namespace Express {
  export interface Request {
    queryPipe: {
      query: string,
      parameters: any[]
    }
  }
}