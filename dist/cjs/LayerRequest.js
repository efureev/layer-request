"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.buildLayerRequest = void 0;
const axios_1 = __importDefault(require("axios"));
const isFunction_1 = __importDefault(require("@feugene/mu/is/isFunction"));
const LayerConfigManager_1 = __importDefault(require("./LayerConfigManager"));
const o = () => Object.create(null);
const buildAxios = (axiosRequestConfig = o()) => {
    // to cancel the request:
    // controller.abort()
    const cancelController = new AbortController();
    const a = axios_1.default.create({
        signal: cancelController.signal,
        ...axiosRequestConfig,
    });
    return {
        cancelController,
        axios: a,
    };
};
const defaultBuilder = (instance) => {
    instance.setAxiosInstances(buildAxios(instance.selectedConfig?.axiosRequestConfig));
};
class LayerRequest {
    constructor(manager = LayerConfigManager_1.default, extra = o()) {
        this.axiosInstances = o();
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
        const currentLayer = this.manager.getLayer(layer, true);
        this.selectedConfig = currentLayer.clone(true);
        this.selectedConfig.setName(currentLayer.getName());
        this.selectedConfig.setExtra(extra);
        this.builder(this);
        this.applyInterceptors(this.selectedConfig.interceptors);
        return this.axiosInstances.axios;
    }
    reset() {
        this.selectedConfig = undefined;
        this.builder = defaultBuilder;
        this.axiosInstances.axios = undefined;
        this.axiosInstances.cancelController = undefined;
        return this;
    }
    normalizeInterceptors(callback) {
        const cb = callback(this.selectedConfig, this.extra);
        let successCb;
        let errorCb;
        if (Array.isArray(cb) && cb.length > 1) {
            successCb = cb[0];
            errorCb = (0, isFunction_1.default)(cb[1]) ? cb[1] : undefined; //(error) => Promise.reject(error)
            return [successCb, errorCb];
        }
        return [cb, undefined];
    }
    registerInterceptors(target, ...source) {
        source.forEach(callback => {
            if (!(0, isFunction_1.default)(callback)) {
                return;
            }
            target.use(...this.normalizeInterceptors(callback));
        });
    }
    applyInterceptors(interceptors) {
        if (!this.selectedConfig || !this.axiosInstances.axios) {
            throw Error('To handle request you should choose a LayerConfig with `useConfig`!');
        }
        interceptors.request &&
            this.registerInterceptors(this.axiosInstances.axios.interceptors.request, ...interceptors.request);
        interceptors.response &&
            this.registerInterceptors(this.axiosInstances.axios.interceptors.response, ...interceptors.response);
    }
    setAxiosInstances(instances) {
        if (!instances.axios) {
            throw Error('You should create Axios instance');
        }
        // @ts-ignore
        instances.axios.$layerRequest = this;
        this.axiosInstances = instances;
    }
    getAxios() {
        return this.axiosInstances.axios;
    }
    getCancel() {
        return this.axiosInstances.cancelController;
    }
    abort(reason) {
        this.axiosInstances.cancelController && this.axiosInstances.cancelController.abort(reason);
    }
}
exports.default = LayerRequest;
function buildLayerRequest(extra = o(), manager) {
    return new LayerRequest(manager, extra);
}
exports.buildLayerRequest = buildLayerRequest;
//# sourceMappingURL=LayerRequest.js.map