import LayerConfig, { ExtraProperties, InterceptorSuccessParam } from '../../src/LayerConfig'
import { AxiosRequestConfig } from 'axios'

const ConsoleInterceptor2 = (options: LayerConfig, extra: ExtraProperties): InterceptorSuccessParam<AxiosRequestConfig> =>
  (config: AxiosRequestConfig): AxiosRequestConfig => {
    console.log('run ConsoleInterceptor 2')

    return config
  }

export default ConsoleInterceptor2
