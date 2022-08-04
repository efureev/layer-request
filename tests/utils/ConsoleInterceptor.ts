import { ExtraProperties, InterceptorSuccessParam } from '../../src'
import { AxiosRequestConfig } from 'axios'
import LayerConfig from '../../src/LayerConfig'

const ConsoleInterceptor = (options: LayerConfig, extra: ExtraProperties): InterceptorSuccessParam<AxiosRequestConfig> =>
  (config: AxiosRequestConfig): AxiosRequestConfig => {
    console.log('run ConsoleInterceptor')
    return config
  }

export default ConsoleInterceptor
