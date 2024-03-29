# Requests with layers config manager

It allows you held on hierarchical multi-config for your axios-requests.

**Base units:**

- Request Config Manager: `LayerConfigManager`
- Request Config: `LayerConfig`
- Request: `LayerRequest`

## How it works

Hierarchical configs:

```mermaid
flowchart LR
	node[<b>axios-config: base</b><hr>name: `api`<br>base url: `/api`]
	
	node1[<b>axios-config: v1</b><hr>name: `v1`<br>base url: `/api/v1`]
	node2[<b>axios-config: v2</b><hr>name: `v2`<br>base url: `/api/v2`]
	
	node2User[<b>axios-config: v2.users</b><hr>name: `v2.users`<br>base url: `/api/v2/users`]
	
	style node text-align:left
	style node1 text-align:left
	style node2 text-align:left
	style node2User text-align:left
	
	node --> node1
	node --> node2
	node2 --> node2User
```

## Basic usage

Add your config and do a request:

```js
import { LayerRequest, globalLayerConfigManager } from '@feugene/layer-request'

const apiRequestConfig = {
  axiosRequestConfig: {
    baseURL: '/api',
  }
}

const layerApi = globalLayerConfigManager.addLayer(apiRequestConfig, 'api')

//...
const layerRequest = new LayerRequest()
const request = layerRequest.useConfig('api')
request.get('users').then(resp => {
})  // --> GET '/api/users'

// it's all!
// if you want to extent you config:

globalLayerConfigManager.addCopyFrom(layerApi, (targetConfig, sourceConfig) => {
  targetConfig.axiosRequestConfig.baseURL += '/v2'
  targetConfig.interceptors.response.push(ConsoleResponseInterceptor2)
  targetConfig.extra.test = 'test'
}, 'v2')

// and then call it:
const request = layerRequest.useConfig('v2')
request.get('users')  // --> GET '/api/v2/users'
```

## Unit Methods

### LayerConfig

It's Axios config container

- clone: Clone a LayerConfig
- getName: Returns LayerConfig's name
- setName: Set a name to a LayerConfig
-

### LayerConfigManager

It's a LayerConfig manager

- addLayer: Add LayerConfig to the container
- getLayer: Returns a LayerConfig
- createLayer: Creates a new LayerConfig
- copyLayer: Copy & return a LayerConfig from an existing LayerConfig
- copyLayerAndSetup: Copy & return a LayerConfig from an existing LayerConfig and set it up
- addCopyFrom: Copy, set it up and add into the container
- updateLayer: Updates currently defined LayerConfig
- all: Returns the all LayerConfigs
- list: Returns the all LayerConfig's names
- reset: Clear the container

### LayerRequest

It's a Request builder

- useConfig: apply some defined in the manager LayerConfig and return the Axios instance
- reset: reset all properties
- getAxios: returns the Axios instance

## Examples

Basic, without config. This request already contains first Config Layer with name `/`:

```js
import { LayerRequest } from '@feugene/layer-request'

const request = new LayerRequest()
```

Basic, with empty config layer manager or custom config:

```js
import { buildLayerRequest } from '@feugene/layer-request'

const request = buildLayerRequest()
```

You can transfer "additional" data within requests and interceptors:

**In request**

```js
import { LayerRequest, LayerConfigManager } from '@feugene/layer-request'

const m = new LayerConfigManager()
// ...
const extra = {
  store: { ... },
  dataWrapper: true,
  // ..
}
const request = new LayerRequest(m, extra)
```

**In layer**

```js
import { LayerRequest, layerConfigManager } from '@feugene/layer-request'

const lc = new LayerConfig({
  axiosRequestConfig: {
    baseURL: '/',
  },
  extra: {
    store: {},
    dataWrapper: true,
  }
})

layerConfigManager.addLayer(lc, 'base')
```

Or when you make request:

```js
const request = r.useConfig(configId, { withoutDataBlock: true })
```

> **Note:** layer's extras & extras bringing in `useConfig` will be merged!

## Add new config layer

```js
const r = buildLayerRequest()

const layoutApi = r.manager.addLayer((cm) => cm.createLayer({
  axiosRequestConfig: {
    headers: {
      host: 'localhost',
    },
    baseURL: '/api',
  },
  interceptors: {
    // request: [...],
    response: [ConsoleResponseInterceptor1],
  },
}))

// add another layer
const layoutV1 = r.manager.addCopyFrom(layoutApi, (targetConfig) => {
  targetConfig.axiosRequestConfig.baseURL += '/v1'
  targetConfig.interceptors.response.push(ConsoleResponseInterceptor2)
})

// or 
configForModule1 = r.manager.addLayer((cm) => {
  const copyLayout = cm.copyLayer(layoutV1)

  copyLayout.axiosRequestConfig.baseURL += '/module1'

  return copyLayout
})
```

Create new layer by coping from existing layer and add it to the manager.

```js
r.manager.addCopyFrom('/api', (targetConfig) => {
  targetConfig.axiosRequestConfig.baseURL += '/v2'
})
// or
r.manager.addCopyFrom(layoutApi, (targetConfig) => {
  targetConfig.axiosRequestConfig.baseURL += '/v3'
})
```

Create config layer with custom name `front`

```js
r.manager.addLayer((cm) => cm.copyLayer('/api'), 'front')
```

Update existing config layer by name (`/api`)

```js
r.manager.updateLayer('/api', (cl) => {
  cl.axiosRequestConfig.baseURL = '/api/admin'
})
```

## Use a request with defined config

```js
const configId = 'api' // type of <string> or <LayerConfig>
const request = r.useConfig(configId)
request.post('store', { key: 1 }) // it'll do POST request on url `/api/v1/module1/store`
request.get('/') // it'll make GET request on url: `/api/v1/module1`

const request = r.useConfig('/api/v2')
request.get('app/users')  // --> GET '/api/v2/app/users'
  .then(resp => {
  })

request.post('app/users/12')  // --> POST '/api/v2/app/users/12'
  .then(resp => {
  })
```  

## Use Interceptors

```js
import { LayerRequest, globalLayerConfigManager } from '@feugene/layer-request'

/**
 * @param {LayerConfig} layerConfig
 * @param {ExtraProperties} requestExtra
 */
const ConsoleLogRequestInterceptor = (layerConfig, requestExtra) =>
  /**
   * @param {AxiosRequestConfig} axiosRequestConfig
   * @return {AxiosRequestConfig}
   */
    (axiosRequestConfig) => {
    console.info(
      `\t🌐 [${axiosRequestConfig.method.toUpperCase()}] ${axiosRequestConfig.baseURL}/${axiosRequestConfig.url}`,
    )
    return axiosRequestConfig
  }

/**
 * @param {boolean} disableLogging
 */
const errHandler = (disableLogging) =>
  /**
   * @param {AxiosError} error
   * @return {Promise<AxiosError>}
   */
    (error) => {
    if (disableLogging) {
      return
    }
    
    console.info(
      `\t❌ [${error.response.config.method.toUpperCase()}]  ${
        error.response.request.responseURL || error.response.request.res.responseUrl
      }`,
    )
    return Promise.reject(error)
  }

/**
 *
 * @param {AxiosResponse} response
 * @return {AxiosResponse}
 */
const successHandler = (response) => {
  console.info(
    `\t✅ [${response.config.method.toUpperCase()}]  ${
      response.request.responseURL || response.request.res.responseUrl
    }`,
  )
  return response
}

/**
 * @param {LayerConfig} layerConfig
 * @param {ExtraProperties} requestExtra
 * @return {[(function(AxiosResponse): AxiosResponse),(function(AxiosError): Promise<AxiosError>)]}
 * @constructor
 */
const ConsoleLogResponseInterceptor = (layerConfig, requestExtra) => [successHandler, errHandler(layerConfig.getExtra('disableErrorLogging'))]

const apiRequestConfig = {
  axiosRequestConfig: {
    baseURL: '/api',
  },
  interceptors: {
    request: [ConsoleLogRequestInterceptor],
    response: [ConsoleLogResponseInterceptor],
  },
}

const layerApi = globalLayerConfigManager.addLayer(apiRequestConfig, 'api')

const layerRequest = new LayerRequest()
const request = layerRequest.useConfig('api', { disableErrorLogging: true })

request.get('/') // will not be logging http errors
```  
