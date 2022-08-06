import type { AxiosRequestConfig } from 'axios';
import type { LayerConfigStringable } from './LayerConfig';
import LayerConfig, { ConfigLayerConstructor } from './LayerConfig';
import { Undef } from './global';
export declare type CreateLayerConfigFunction = (manager: LayerConfigManager) => AxiosRequestConfig | LayerConfig;
declare type CreateLayerConfig = AxiosRequestConfig | LayerConfig | CreateLayerConfigFunction;
declare type ModifyLayerConfigFn = (l: LayerConfig) => void;
declare type CopyLayerConfigFn = (target: LayerConfig, source: LayerConfig) => void;
export declare class LayerConfigManager {
    addLayer(configValue: CreateLayerConfig, name?: string): LayerConfig;
    getLayer(name: LayerConfigStringable, throws?: boolean): Undef<LayerConfig>;
    list(): string[];
    all(): Map<string, LayerConfig>;
    reset(): this;
    /**
     * Add a copy of an existing LayerConfig to the Layer Manager
     */
    addCopyFrom(fromLayer: LayerConfigStringable, fn: CopyLayerConfigFn, newLayer?: string): LayerConfig;
    /**
     * Copy a LayerConfig from an existing LayerConfig and set it up
     */
    copyLayerAndSetup(fromLayer: LayerConfigStringable, fn: CopyLayerConfigFn): LayerConfig;
    /**
     * Copy a LayerConfig from an existing LayerConfig
     */
    copyLayer(name: LayerConfigStringable): LayerConfig;
    /**
     * Update a LayerConfig by its name
     */
    updateLayer(name: string, fn: ModifyLayerConfigFn): this;
    createLayer(options: ConfigLayerConstructor): LayerConfig;
}
declare const manager: LayerConfigManager;
export default manager;
//# sourceMappingURL=LayerConfigManager.d.ts.map