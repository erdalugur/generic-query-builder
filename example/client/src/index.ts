import { Request } from 'generic-query-builder-client'

const request = new Request('http://localhost:3000')

request.Read<any>('cms_users').then(x => {
  console.log(x)
})
