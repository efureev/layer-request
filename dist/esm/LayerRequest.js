import axios from 'axios';
import { isFunction, isObject } from '@feugene/mu';
import layerConfigManager from './LayerConfigManager';

const o = () => Object.create(null);

const buildAxios = instance => {
  const cancelToken = axios.CancelToken.source();
  const a = axios.create({
    cancelToken: cancelToken.token,
    ...(instance.selectedConfig?.axiosRequestConfig || o())
  }); // @ts-ignore

  a.wrapper = instance;
  const ai = {
    cancelToken,
    axios: a
  };
  instance.setAxiosInstances(ai);
};
/**
 * @param {LayerRequest} instance
 */


const defaultBuilder = instance => {
  buildAxios(instance);
};

export default class LayerRequest {
  axiosInstances = o();

  constructor(manager = layerConfigManager, extra = o()) {
    this.manager = manager;
    this.extra = extra;
    this.builder = defaultBuilder;
  }

  useConfig(layer, extra = o()) {
    if (!layer) {
      const layerName = this.manager.list().shift();

      if (!layerName) {
        throw Error('Missing name of a LayerConfig');
      }

      layer = layerName;
    }

    const sc = this.manager.getLayer(layer, true);
    this.selectedConfig = sc.clone();
    this.selectedConfig.setName(sc.getName());
    this.selectedConfig.extra = { ...sc.extra,
      ...(isObject(extra) ? extra : o())
    };
    this.builder(this);
    this.applyInterceptors(this.selectedConfig.interceptors);
    return this.axiosInstances.axios;
  }
  /**
   * @deprecated
   * @use `useConfig`
   */


  build(layer, extra = o()) {
    return this.useConfig(layer, extra);
  }

  reset() {
    this.selectedConfig = undefined;
    this.builder = defaultBuilder;
    this.axiosInstances.axios = undefined;
    this.axiosInstances.cancelToken = undefined;
    return this;
  }

  normalizeInterceptors(callback) {
    const cb = callback(this.selectedConfig, this.extra);
    let successCb;
    let errorCb;

    if (Array.isArray(cb) && cb.length > 1) {
      successCb = cb[0];
      errorCb = isFunction(cb[1]) ? cb[1] : undefined; //(error) => Promise.reject(error)

      return [successCb, errorCb];
    }

    return [cb, undefined];
  }

  registerInterceptors(target, ...source) {
    source.forEach(callback => {
      if (!isFunction(callback)) {
        return;
      }

      target.use(...this.normalizeInterceptors(callback));
    });
  }

  applyInterceptors(interceptors) {
    if (!this.selectedConfig || !this.axiosInstances.axios) {
      throw Error('To handle request you should choose a LayerConfig with `useConfig`!');
    }

    interceptors.request && this.registerInterceptors(this.axiosInstances.axios.interceptors.request, ...interceptors.request);
    interceptors.response && this.registerInterceptors(this.axiosInstances.axios.interceptors.response, ...interceptors.response);
  }

  setAxiosInstances(instances) {
    this.axiosInstances = instances;
  }

  getAxios() {
    return this.axiosInstances.axios;
  }

}
export function buildLayerRequest(extra = o(), manager) {
  return new LayerRequest(manager, extra);
}
//# sourceMappingURL=LayerRequest.js.map