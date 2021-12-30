import { createInstance } from '../src'

const request = createInstance('http://localhost:3000')

request.Read('cms_users', {}).then(x => {
  console.log(x)
})