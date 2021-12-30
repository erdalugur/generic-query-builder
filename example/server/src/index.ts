import express from 'express'
import dotenv from 'dotenv'
import { useQueryMiddleware, ErrorFn, SuccessFn } from 'generic-query-builder'

dotenv.config()

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

const succesFn: SuccessFn = (data, req, res, next) => {
  res.json(data)
}

const genericQueryBuilderMiddleware = useQueryMiddleware({
  itemsPerRequest: 1000,
  dbConfig: db,
  onSuccess: succesFn,
  onError: errorFn
})

const path = '/:action/:collection'

app.post(path, genericQueryBuilderMiddleware)

app.listen(3000, () => console.log('http://localhost:3000'))