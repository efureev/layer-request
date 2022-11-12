"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LayerConfig = void 0;
const mu_1 = require("@feugene/mu");
function buildBaseAxiosConfig() {
    return {
        baseURL: `/`,
        headers: {},
    };
}
const o = () => Object.create(null);
class LayerConfig {
    constructor(properties) {
        this.axiosRequestConfig = {};
        this.extra = o();
        this.interceptors = {
            request: [],
            response: [],
        };
        this.axiosRequestConfig = properties?.axiosRequestConfig || buildBaseAxiosConfig();
        this.interceptors = (0, mu_1.merge)({
            request: [],
            response: [],
        }, properties?.interceptors);
        if (properties?.extra) {
            this.setExtra(properties?.extra);
        }
    }
    clone(withExtra = false) {
        const l = new LayerConfig((0, mu_1.clone)(this.toConfigObject()));
        if (withExtra) {
            l.setExtra(this.getExtra());
        }
        return l;
    }
    getName() {
        return this.name;
    }
    setName(name) {
        if ((0, mu_1.isEmpty)(name)) {
            if ((0, mu_1.isEmpty)(this.axiosRequestConfig.baseURL)) {
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
            from: this.from,
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
        if ((0, mu_1.isObject)(data)) {
            this.extra = {
                ...this.extra,
                ...data,
            };
        }
    }
}
exports.LayerConfig = LayerConfig;
exports.default = LayerConfig;
//# sourceMappingURL=LayerConfig.js.map