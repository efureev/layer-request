import { AxiosInstance, CancelTokenSource } from 'axios';
import type { LayerConfigManager } from './LayerConfigManager';
import type { ExtraProperties, LayerConfigStringable } from './LayerConfig';
import LayerConfig from './LayerConfig';
declare type BuilderCreator = (r: LayerRequest) => void;
interface AxiosInstances {
    axios?: AxiosInstance;
    cancelToken?: CancelTokenSource;
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
    getAxios(): AxiosInstance | undefined;
}
export declare function buildLayerRequest(manager?: LayerConfigManager, extra?: ExtraProperties): LayerRequest;
export {};
//# sourceMappingURL=LayerRequest.d.ts.map