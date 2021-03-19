import ConfigLayer from './src/ConfigLayer'
import Request from './src/Request'
import manager, { ConfigLayerManager } from './src/ConfigLayerManager'

export default function buildRequest(config = {}) {
  return new Request(config)
}

export {
  Request,
  ConfigLayer,
  ConfigLayerManager,
  manager,
}
