> `Generic Query Builder`

<p>Almost all projects use api  and they are have backend developers.</p>
<p>This project fast development and productivity provide for small and micro products. </p> 
<p>You can use this project have you headless cms or if you have small development team.</p>
<p>This project generate dynamic query build at runtime</p>

<hr>

`Available Features Here`

- Select
- Insert
- Update
- Upsert (update or insert)
- Delete



`How To Use`

```js
// step 1: install package
npm install generic-query-builder

// step 2: include project
import express from 'express'
import { useQueryMiddleware, ErrorFn, SuccessFn } from 'generic-query-builder'

const app = express()

// required
app.use(express.json())

const db = {
  "host": process.env['DB_HOST'],
  "user": process.env['DB_USER'],
  "password": process.env['DB_PASSWORD'],
  "database": process.env['DATABASE']
}

const errorFn: ErrorFn = (err, req, res, next) => {
  res.status(400)
  res.json(err)
}

const successFn: SuccessFn = (data, req, res, next) => {
  res.json(data)
}

const genericQueryBuilderMiddleware = useQueryMiddleware({
  itemsPerRequest: 1000,
  dbConfig: db,
  onSuccess: successFn,
  onError: errorFn
})

// Terms
// - All requests must be POST request
// - Must be a route like
// - Do not changes this
// - But you can addition prefix

app.post('/:action/:collection', genericQueryBuilderMiddleware)

app.listen(3000, () => console.log('http://localhost:3000'))

```
`Query Examples`

```js 
// your server like this: http://localhost:3000
// for example queries for products
```

> Select Query Example
```js
// endpoint: http://localhost:3000/read/products

// request body (not required)
{
  // optional columns taking
  "Columns": ["name", "id"]
  // optional taking limit
  "Limit": 1000
  // optional and conditions
  "Where": [{"Key": "id", "Value": 1, "Operator": ">" }],
  // optional or conditions
  "OrWhere": [{"Key": "id", "Value": 10, "Operator": "<" }],
  // optional order by
  "OrderBy":{"id": "asc"},
  // optional joins
  "Joins": [
    { 
      "Type": "LEFT", // INNER - RIGHT - FULL OUTER
      "Collection": "categories", 
      "PrimaryKey": "id", 
      "ParentKey": "category_id", 
      "Columns": [{"Alias": "category", "Column": "name"}]
    }
  ]
}
```

> Insert Query Example
```js
// endpoint: http://localhost:3000/create/products

// request body (required)
{
  "Record": [
    { "name": "apple" },
    { "name": "orange" }
  ]
}
```

> Update Query Example
```js
// endpoint: http://localhost:3000/update/products

// request body (required)
{
  "Record": { "name": "banana" },
  "Where": [
    { 
      "Key": "id", 
      "Value": 1, 
      "Operator": "=" 
    }
  ]
}
```

> Upsert Query Example
```js
// endpoint: http://localhost:3000/upsert/products

// request body (required)
{
  "Record": { "name": "cherry" },
  "Where": [
    { 
      "Key": "id", 
      "Value": 1, 
      "Operator": "=" 
    }
  ]
}
```

> Delete Query Example
```js
// endpoint: http://localhost:3000/delete/products

// request body (required)
{
  "Where": [
    { 
      "Key": "id", 
      "Value": 1, 
      "Operator": "=" 
    }
  ]
}
```
