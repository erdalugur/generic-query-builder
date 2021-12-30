export enum GenericQueryBuilderSortingType { ASC = 'asc', DESC = 'desc'}

export enum GenericQueryBuilderWhereOperatorType { 
  EQUAL = '=', 
  NOT_EQUAL = '<>', 
  GREATER_THAN = '>', 
  LESS_THAN = '<', 
  GREATER_THAN_EQUAL = '>=', 
  LESS_THAN_EQUAL = '<=' 
}

export interface GenericQueryBuilderWhere {
  Key: string
  Value: any
  Operator: GenericQueryBuilderWhereOperatorType
}

export enum GenericQueryBuilderJoinType { LEFT = 'LEFT', RIGTH = 'RIGTH', INNER = 'INNER' }

export interface GenericQueryBuilderJoin {
  Collection: string,
  PrimaryKey: string,
  Columns: string[] | GenericQueryBuilderSelectColumn[],
  ParentKey: string,
  Type?: GenericQueryBuilderJoinType
}

export interface GenericQueryBuilderDistinct {
  Collection: string
  Column: string
}

export interface GenericQueryBuilderSelectColumn {
  Alias: string
  Column: string
}

export enum GenericQueryBuilderDatabaseType { POSTGRES = 'pg', MONGO = 'mongo' }

export enum GenericQueryBuilderActionType { CREATE = 'create', READ = 'read', UPDATE = 'update', DELETE = 'delete', UPSERT = 'upsert', SCHEMA = 'schema' }


export interface GenericQueryBuilderReadCommand {
  Columns: string[] | GenericQueryBuilderSelectColumn[]
  Where?: GenericQueryBuilderWhere[]
  OrWhere?: GenericQueryBuilderWhere[]
  OrderBy?: Record<string, GenericQueryBuilderSortingType>
  Limit?: number
  Joins?: GenericQueryBuilderJoin[]
  Distinct?: string[]
}
export interface GenericQueryBuilderCreateCommand {
  Record: Record<string, any> []
  Select?: string[]
}

export interface GenericQueryBuilderDeleteCommand {
  Where: GenericQueryBuilderWhere[]
  OrWhere?: GenericQueryBuilderWhere[]
}

export interface GenericQueryBuilderUpdateCommand {
  Record: Record<string, any>
  Where: GenericQueryBuilderWhere[]
}
export interface GenericQueryBuilderSchemaCommand {
  Where: Array<GenericQueryBuilderWhere>
  Columns: string[]
}

