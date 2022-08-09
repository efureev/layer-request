import { ExtraProperties, InterceptorSuccessParam } from '../../src'
import { AxiosRequestConfig } from 'axios'
import LayerConfig from '../../src/LayerConfig'

const ConsoleInterceptor = (layerConfig: LayerConfig, requestExtra: ExtraProperties): InterceptorSuccessParam<AxiosRequestConfig> =>
  (axiosConfig: AxiosRequestConfig): AxiosRequestConfig => {
    console.log('run ConsoleInterceptor')
    return axiosConfig
  }

export default ConsoleInterceptor
