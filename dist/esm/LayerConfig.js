import { clone, isEmpty, isObject, merge } from '@feugene/mu';

function buildBaseAxiosConfig() {
  return {
    baseURL: `/`,
    headers: {}
  };
}

const o = () => Object.create(null);

export class LayerConfig {
  axiosRequestConfig = {};
  extra = o();
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

    if (properties?.extra) {
      this.setExtra(properties?.extra);
    }
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

  getExtra(key) {
    return key ? this.extra[key] : this.extra;
  }

  setExtra(data, value) {
    if (typeof data === 'string') {
      const e = o();
      e[data] = value;
      data = e;
    }

    if (isObject(data)) {
      this.extra = { ...this.extra,
        ...data
      };
    }
  }

}
export default LayerConfig;
//# sourceMappingURL=LayerConfig.js.map