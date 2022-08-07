import { AxiosResponse } from 'axios'
import LayerConfig, { ExtraProperties, InterceptorSuccessParam } from '../../src/LayerConfig'

const ConsoleResponseInterceptor1 = (options: LayerConfig, extra: ExtraProperties): InterceptorSuccessParam<AxiosResponse> =>
  (response: AxiosResponse): AxiosResponse => {
    console.log('run ConsoleResponseInterceptor 1')

    return response
  }

export default ConsoleResponseInterceptor1
