import type { AxiosRequestConfig, AxiosResponse } from 'axios';
import type { Recordable } from './global';
export declare type InterceptorSuccessParam<T> = (value: T) => T | Promise<T>;
export declare type InterceptorErrorParam = ((error: any) => any) | undefined;
export declare type InterceptorNormal<T> = [InterceptorSuccessParam<T>, InterceptorErrorParam];
export declare type InterceptorType<T> = InterceptorSuccessParam<T> | InterceptorNormal<T>;
export declare type InterceptorFn<T> = (layer: LayerConfig, extra: ExtraProperties) => InterceptorType<T>;
export interface ConfigLayerInterceptors {
    request: InterceptorFn<AxiosRequestConfig>[];
    response: InterceptorFn<AxiosResponse>[];
}
export interface ConfigLayerConstructor {
    axiosRequestConfig: AxiosRequestConfig;
    interceptors: Partial<ConfigLayerInterceptors>;
    from?: string;
    extra?: ExtraProperties;
}
export declare type ExtraProperties = Recordable;
export declare type LayerConfigStringable = LayerConfig | string;
export default class LayerConfig {
    axiosRequestConfig: AxiosRequestConfig;
    private name?;
    from?: string;
    private extra;
    interceptors: ConfigLayerInterceptors;
    constructor(properties?: ConfigLayerConstructor);
    clone(): LayerConfig;
    getName(): string;
    setName(name?: string): void;
    protected toConfigObject(): ConfigLayerConstructor;
    getExtra(key?: string): ExtraProperties | any;
    setExtra(data: ExtraProperties | string, value?: any): void;
}
//# sourceMappingURL=LayerConfig.d.ts.map