import type { AxiosRequestConfig, AxiosResponse } from 'axios';
import type { Recordable } from './global';
export declare type InterceptorSuccessParam<T, R = T> = (value: T) => R | Promise<R>;
export declare type InterceptorErrorParam = ((error: any) => any) | undefined;
export declare type InterceptorNormal<T, R = T> = [InterceptorSuccessParam<T, R>, InterceptorErrorParam];
export declare type InterceptorType<T, R = T> = InterceptorSuccessParam<T, R> | InterceptorNormal<T, R>;
export declare type InterceptorFn<T, R = T> = (layer: LayerConfig, extra: ExtraProperties) => InterceptorType<T, R>;
export interface ConfigLayerInterceptors {
    request: InterceptorFn<AxiosRequestConfig>[];
    response: InterceptorFn<AxiosResponse>[];
}
export interface ConfigLayerConstructor {
    axiosRequestConfig: AxiosRequestConfig;
    interceptors?: Partial<ConfigLayerInterceptors>;
    from?: string;
    extra?: ExtraProperties;
}
export declare type ExtraProperties = Recordable;
export declare type LayerConfigStringable = LayerConfig | string;
export declare class LayerConfig {
    axiosRequestConfig: AxiosRequestConfig;
    private name?;
    from?: string;
    private extra;
    interceptors: ConfigLayerInterceptors;
    constructor(properties?: ConfigLayerConstructor);
    clone(withExtra?: boolean): LayerConfig;
    getName(): string;
    setName(name?: string): void;
    protected toConfigObject(): ConfigLayerConstructor;
    getExtra(key?: string): ExtraProperties | any;
    setExtra(data: ExtraProperties | string, value?: any): void;
}
export default LayerConfig;
//# sourceMappingURL=LayerConfig.d.ts.map