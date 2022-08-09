import LayerConfig, { ExtraProperties, InterceptorSuccessParam } from '../../src/LayerConfig'
import { AxiosRequestConfig } from 'axios'

const ConsoleInterceptor2 = (layerConfig: LayerConfig, requestExtra: ExtraProperties): InterceptorSuccessParam<AxiosRequestConfig> =>
  (axiosConfig: AxiosRequestConfig): AxiosRequestConfig => {
    console.log('run ConsoleInterceptor 2')

    return axiosConfig
  }

export default ConsoleInterceptor2
