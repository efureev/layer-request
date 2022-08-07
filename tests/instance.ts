import assert from 'assert'
import { buildLayerRequest, globalLayerConfigManager, LayerConfig, LayerConfigManager, LayerRequest } from '../src'
import { isEmpty, isObject } from '@feugene/mu'
import ConsoleResponseInterceptor1 from './utils/ConsoleResponseInterceptor1'
import ConsoleResponseInterceptor2 from './utils/ConsoleResponseInterceptor2'

describe('create request by default', () => {
  describe('checking Request', () => {
    it('initialization', () => {
      globalLayerConfigManager.reset()
      const request = buildLayerRequest()

      assert.strictEqual(true, request instanceof LayerRequest)
      assert.strictEqual(true, request.getAxios() == null)

      assert.strictEqual(true, request.manager instanceof LayerConfigManager)
      assert.strictEqual(true, isObject(request.extra))
      assert.strictEqual(true, isEmpty(request.extra))

      assert.strictEqual(true, request.manager.all() instanceof Map)
      assert.strictEqual(0, request.manager.list().length)
      assert.strictEqual(undefined, request.manager.getLayer('/'))

    })

    it('creating with empty layers', () => {
      globalLayerConfigManager.reset()

      const request = buildLayerRequest({ test: 1 })

      assert.strictEqual(true, request instanceof LayerRequest)
      assert.strictEqual(true, request.getAxios() == null)

      assert.strictEqual(true, request.manager instanceof LayerConfigManager)
      assert.strictEqual(true, isObject(request.extra))
      assert.strictEqual(true, !isEmpty(request.extra))
      assert.strictEqual(true, request.extra.test === 1)

      assert.strictEqual(true, request.manager.all() instanceof Map)
      assert.strictEqual(0, request.manager.list().length)
    })
  })

  it('creating layers', () => {
    globalLayerConfigManager.reset()
    const r = new LayerRequest()

    const layoutApi = r.manager.addLayer((cm) => cm.createLayer({
      axiosRequestConfig: {
        headers: {
          host: 'localhost',
        },
        baseURL: '/api',
      },
      interceptors: {
        response: [ConsoleResponseInterceptor1],
      },
    }))

    assert.strictEqual(true, r.getAxios() == null)
    assert.strictEqual(true, isObject(r.extra))
    assert.strictEqual(true, isEmpty(r.extra))
    assert.strictEqual(true, r.manager.all() instanceof Map)
    assert.strictEqual(1, r.manager.list().length)
    assert.strictEqual(true, r.manager.getLayer('/api') instanceof LayerConfig)
    assert.strictEqual(true, r.manager.getLayer('/api') instanceof LayerConfig)
    assert.strictEqual(true, layoutApi instanceof LayerConfig)
    assert.strictEqual(true, r.manager.getLayer('/api') === layoutApi)

    const layoutV1 = r.manager.addLayer((cm) => {
      const copyLayout = cm.copyLayer(layoutApi)

      copyLayout.axiosRequestConfig.baseURL += '/v1'
      copyLayout.setExtra('store', 'text')

      return copyLayout
    })

    assert.strictEqual(true, r.getAxios() == null)
    assert.strictEqual(true, isObject(r.extra))
    assert.strictEqual(true, isEmpty(r.extra))
    assert.strictEqual(2, r.manager.list().length)
    assert.strictEqual(1, layoutV1.interceptors.response.length)

    const layoutSm = r.manager.addCopyFrom(layoutV1, (targetConfig, sourceConfig) => {
      targetConfig.axiosRequestConfig.baseURL += '/sub-module'
      targetConfig.interceptors.response.push(ConsoleResponseInterceptor2)
      targetConfig.setExtra(sourceConfig.getExtra())
    })
    assert.strictEqual(true, r.getAxios() == null)
    assert.strictEqual(true, isObject(r.extra))
    assert.strictEqual(true, isEmpty(r.extra))
    assert.strictEqual(true, layoutSm.getExtra('store') === 'text')
    assert.strictEqual(3, r.manager.list().length)
    assert.strictEqual(2, layoutSm.interceptors.response.length)

    const layerV2 = r.manager.addLayer((cm) => {
      const copyLayout = cm.copyLayer('/api')

      copyLayout.axiosRequestConfig.baseURL += '/v2'

      return copyLayout
    })

    assert.strictEqual(true, r.getAxios() == null)
    assert.strictEqual(true, isObject(r.extra))
    assert.strictEqual(true, isEmpty(r.extra))
    assert.strictEqual(4, r.manager.list().length)
    assert.strictEqual(1, layerV2.interceptors.response.length)

    const layerModule1 = r.manager.addLayer((cm) => {
      const copyLayout = cm.copyLayer('/api/v1')

      copyLayout.axiosRequestConfig.baseURL += '/module-1'

      return copyLayout
    }, 'module-1')

    assert.strictEqual(5, r.manager.list().length)
    assert.strictEqual(1, layerModule1.interceptors.response.length)

    console.log(`layerModule1.getExtra()`, layerModule1.getExtra())

    assert.strictEqual(true, layerModule1.getExtra().store === undefined)

    r.manager.addLayer((cm) => cm.copyLayer('/api'), 'front')

    assert.strictEqual(6, r.manager.list().length)

    r.manager.updateLayer('/api', (cl) => {
      cl.axiosRequestConfig.baseURL = '/api/admin'
    })
    assert.strictEqual(6, r.manager.list().length)
    assert.strictEqual('/api/admin', layoutApi.axiosRequestConfig.baseURL)
    assert.strictEqual('/api/admin', r.manager.getLayer('/api')?.axiosRequestConfig.baseURL)
  })

  it('merge extras', () => {
    globalLayerConfigManager.reset()
    const layerRequest = new LayerRequest()

    const layoutApi = globalLayerConfigManager
      .addLayer((cm) =>
        cm.createLayer({
          axiosRequestConfig: { baseURL: '/api' },
          extra: {
            test1: 'zzz',
            test3: undefined,
          },
        }))

    const axiosRequest1 = layerRequest.useConfig(layoutApi)

    assert.strictEqual(true, isObject(layerRequest.selectedConfig.getExtra()))

    assert.deepEqual({ test1: 'zzz', test3: undefined }, layerRequest.selectedConfig.getExtra())

    const axiosRequest2 = layerRequest.useConfig(layoutApi, {
      test1: 'aaaa',
      test2: 'Yahhoooo',
    })

    assert.strictEqual(true, isObject(layerRequest.selectedConfig.getExtra()))
    assert.strictEqual('aaaa', layerRequest.selectedConfig.getExtra('test1'))
    assert.deepEqual({
      test1: 'aaaa',
      test2: 'Yahhoooo',
      test3: undefined,
    }, layerRequest.selectedConfig.getExtra())
  })
})
