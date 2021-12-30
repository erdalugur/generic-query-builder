import { createInstance } from 'generic-query-builder-client'

const request = createInstance('http://localhost:3000')

request.Read('cms_users').then(x => {
  console.log(x)
})