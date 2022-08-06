import type { AxiosInstance } from 'axios';
import type { LayerConfigManager } from './LayerConfigManager';
import type { ExtraProperties, LayerConfig, LayerConfigStringable } from './LayerConfig';
import { Undef } from './global';
declare type BuilderCreator = (r: LayerRequest) => void;
interface AxiosInstances {
    axios?: AxiosInstance;
    cancelController?: AbortController;
}
export default class LayerRequest {
    readonly manager: LayerConfigManager;
    readonly extra: ExtraProperties;
    builder: BuilderCreator;
    selectedConfig?: LayerConfig;
    private axiosInstances;
    constructor(manager?: LayerConfigManager, extra?: ExtraProperties);
    useConfig(layer: LayerConfigStringable, extra?: ExtraProperties): AxiosInstance;
    /**
     * @deprecated
     * @use `useConfig`
     */
    build(layer: LayerConfigStringable, extra?: ExtraProperties): AxiosInstance;
    reset(): this;
    private normalizeInterceptors;
    private registerInterceptors;
    private applyInterceptors;
    setAxiosInstances(instances: AxiosInstances): void;
    getAxios(): Undef<AxiosInstance>;
    getCancel(): Undef<AbortController>;
    abort(reason?: any): void;
}
export declare function buildLayerRequest(extra?: ExtraProperties, manager?: LayerConfigManager): LayerRequest;
export {};
//# sourceMappingURL=LayerRequest.d.ts.map