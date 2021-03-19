# request with layers config

## Basic usage

Basic, without config. This request already contains first Config Layer with name `/`:
```js
import buildRequest from '@feugene/layer-request'
// ...
const request = buildRequest()
```

Basic, with empty config layer manager or custom config:
```js
import buildRequest, {manager} from '@feugene/layer-request'
// ...
const request = buildRequest({manager})

// ...
const extra = {
  // store: {...},
  test: 1,
  // ..
}
const request = buildRequest({manager, extra})
```

## Add new config layer

```js
const r = buildRequest()

const layoutApi = r.manager.addLayer((cm) => cm.new({
  requestConfig: {
    headers: {
      common: {
        host: 'localhost',
      },
    },
    baseURL: '/api',
  },
  interceptors: {
    response: [ConsoleResponseInterceptor1],
  },
}))

// add another layer
const layoutV1 = r.manager.addCopyFrom(layoutApi, (targetConfig) => {
  targetConfig.requestConfig.baseURL += '/v1'
  targetConfig.interceptors.response.push(ConsoleResponseInterceptor2)
})

// or 
configForModule1 = r.manager.addLayer((cm) => {
  const copyLayout = cm.copyLayer(layoutV1)
  
  copyLayout.requestConfig.baseURL += '/module1'

  return copyLayout
})
```

Create new layer by coping from existing layer and add it to the manager.  
```js
r.manager.addCopyFrom('/api', (targetConfig) => {
  targetConfig.requestConfig.baseURL += '/v2'
})
// or
r.manager.addCopyFrom(layoutApi, (targetConfig) => {
  targetConfig.requestConfig.baseURL += '/v3'
})
```

Create config layer with custom name `front`
```js
r.manager.addLayer((cm) => cm.copyLayer('/api'), 'front')
```

Update existing config layer by name (`/api`)
```js
r.manager.updateLayer('/api', (cl) => {
  cl.requestConfig.baseURL = '/api/admin'
})
```

## Execute a request

```js
const request = r.build(configForModule1)
request.post('store', {key:1}) // it'll make POST request on url `/api/v1/module1/store`
request.get('/') // it'll make GET request on url: `/api/v1/module1`

r.build('/api/v2')
  .get('app/users')  // --> '/api/v2/app/users'
      .then(resp=>{})
      .catch(err=>{}) 
```  
