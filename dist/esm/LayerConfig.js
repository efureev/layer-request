import { clone, isEmpty, merge } from '@feugene/mu';

function buildBaseAxiosConfig() {
  return {
    baseURL: `/`,
    headers: {}
  };
}

export default class LayerConfig {
  axiosRequestConfig = {};
  extra = Object.create(null);
  interceptors = {
    request: [],
    response: []
  };

  constructor(properties) {
    this.axiosRequestConfig = properties?.axiosRequestConfig || buildBaseAxiosConfig();
    this.interceptors = merge({
      request: [],
      response: []
    }, properties?.interceptors);
  }

  clone() {
    return new LayerConfig(clone(this.toConfigObject()));
  }

  getName() {
    return this.name;
  }

  setName(name) {
    if (isEmpty(name)) {
      if (isEmpty(this.axiosRequestConfig.baseURL)) {
        throw Error('You should add `name` to your layer or config must contains `baseURL` attribute!');
      }

      name = this.axiosRequestConfig.baseURL;
    }

    this.name = name;
  }

  toConfigObject() {
    return {
      axiosRequestConfig: this.axiosRequestConfig,
      interceptors: this.interceptors,
      from: this.from
    };
  }

}
//# sourceMappingURL=LayerConfig.js.map