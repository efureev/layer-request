import { AxiosResponse } from 'axios'
import LayerConfig, { ExtraProperties } from '../../src/LayerConfig'

const ConsoleResponseInterceptor1 = (options: LayerConfig, extra: ExtraProperties) => (response: AxiosResponse): AxiosResponse => {
  console.log('run ConsoleResponseInterceptor 1')

  return response
}

export default ConsoleResponseInterceptor1
