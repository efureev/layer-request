import buildRequest, { ConfigLayer, Request } from '../'
import manager, { ConfigLayerManager } from '../src/ConfigLayerManager'

import assert from 'assert'
import { isEmpty, isObject } from '@feugene/mu/src/is'
import ConsoleResponseInterceptor1 from './utils/ConsoleResponseInterceptor1'
import ConsoleResponseInterceptor2 from './utils/ConsoleResponseInterceptor2'

describe('create request by default', () => {
  describe('checking Request', () => {
    it('initialization', () => {
      manager.reset()
      const request = buildRequest()

      assert.strictEqual(true, request instanceof Request)
      assert.strictEqual(true, request.axios == null)

      assert.strictEqual(true, request.manager instanceof ConfigLayerManager)
      assert.strictEqual(true, isObject(request.extra))
      assert.strictEqual(true, isEmpty(request.extra))

      assert.strictEqual(true, request.manager.all() instanceof Map)
      assert.strictEqual(0, request.manager.list().length)
      assert.strictEqual(null, request.manager.getLayer('/'))

    })

    it('creating with empty layers', () => {
      manager.reset()

      const request = buildRequest({
        manager,
        extra: { test: 1 },
      })

      assert.strictEqual(true, request instanceof Request)
      assert.strictEqual(true, request.axios == null)

      assert.strictEqual(true, request.manager instanceof ConfigLayerManager)
      assert.strictEqual(true, isObject(request.extra))
      assert.strictEqual(true, !isEmpty(request.extra))
      assert.strictEqual(true, request.extra.test === 1)

      assert.strictEqual(true, request.manager.all() instanceof Map)
      assert.strictEqual(0, request.manager.list().length)
    })
  })

  it('creating layers', () => {
    manager.reset()
    const r = buildRequest({ manager })

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

    assert.strictEqual(true, r.axios == null)
    assert.strictEqual(true, isObject(r.extra))
    assert.strictEqual(true, isEmpty(r.extra))
    assert.strictEqual(true, r.manager.all() instanceof Map)
    assert.strictEqual(1, r.manager.list().length)
    assert.strictEqual(true, r.manager.getLayer('/api') instanceof ConfigLayer)

    assert.strictEqual(true, r.manager.getLayer('/api') instanceof ConfigLayer)
    assert.strictEqual(true, layoutApi instanceof ConfigLayer)
    assert.strictEqual(true, r.manager.getLayer('/api') === layoutApi)

    const layoutV1 = r.manager.addLayer((cm) => {
      const copyLayout = cm.copyLayer(layoutApi)

      copyLayout.requestConfig.baseURL += '/v1'

      return copyLayout
    })

    assert.strictEqual(true, r.axios == null)
    assert.strictEqual(true, isObject(r.extra))
    assert.strictEqual(true, isEmpty(r.extra))
    assert.strictEqual(2, r.manager.list().length)
    assert.strictEqual(1, layoutV1.interceptors.response.length)

    const layoutSm = r.manager.addCopyFrom(layoutV1, (targetConfig) => {
      targetConfig.requestConfig.baseURL += '/sub-module'
      targetConfig.interceptors.response.push(ConsoleResponseInterceptor2)
    })

    assert.strictEqual(true, r.axios == null)
    assert.strictEqual(true, isObject(r.extra))
    assert.strictEqual(true, isEmpty(r.extra))
    assert.strictEqual(3, r.manager.list().length)
    assert.strictEqual(2, layoutSm.interceptors.response.length)

    const layerV2 = r.manager.addLayer((cm) => {
      const copyLayout = cm.copyLayer('/api')

      copyLayout.requestConfig.baseURL += '/v2'

      return copyLayout
    })

    assert.strictEqual(true, r.axios == null)
    assert.strictEqual(true, isObject(r.extra))
    assert.strictEqual(true, isEmpty(r.extra))
    assert.strictEqual(4, r.manager.list().length)
    assert.strictEqual(1, layerV2.interceptors.response.length)

    const layerModule1 = r.manager.addLayer((cm) => {
      const copyLayout = cm.copyLayer('/api/v1')

      copyLayout.requestConfig.baseURL += '/module-1'
      delete copyLayout.test

      return copyLayout
    }, 'module-1')

    assert.strictEqual(5, r.manager.list().length)
    assert.strictEqual(1, layerModule1.interceptors.response.length)

    r.manager.addLayer((cm) => cm.copyLayer('/api'), 'front')

    assert.strictEqual(6, r.manager.list().length)

    r.manager.updateLayer('/api', (cl) => {
      cl.requestConfig.baseURL = '/api/admin'
    })
    assert.strictEqual(6, r.manager.list().length)
    assert.strictEqual('/api/admin', layoutApi.requestConfig.baseURL)
    assert.strictEqual('/api/admin', r.manager.getLayer('/api').requestConfig.baseURL)
  })

})
