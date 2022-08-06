import { AxiosInstance, CancelTokenSource } from 'axios';
import type { LayerConfigManager } from './LayerConfigManager';
import type { ExtraProperties, LayerConfigStringable } from './LayerConfig';
import LayerConfig from './LayerConfig';
import { Recordable } from './global';
declare type BuilderCreator = (r: LayerRequest) => void;
interface AxiosInstances {
    axios?: AxiosInstance;
    cancelToken?: CancelTokenSource;
}
export declare type LayerRequestExtraProperties = Recordable;
export default class LayerRequest {
    readonly manager: LayerConfigManager;
    readonly extra: LayerRequestExtraProperties;
    builder: BuilderCreator;
    selectedConfig?: LayerConfig;
    private axiosInstances;
    constructor(manager?: LayerConfigManager, extra?: LayerRequestExtraProperties);
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
    getAxios(): AxiosInstance | undefined;
}
export declare function buildLayerRequest(extra?: LayerRequestExtraProperties, manager?: LayerConfigManager): LayerRequest;
export {};
//# sourceMappingURL=LayerRequest.d.ts.map