import LayerConfig, { ExtraProperties } from '../../src/LayerConfig'
import { AxiosResponse } from 'axios'

const ConsoleResponseInterceptor2 = (options: LayerConfig, extra: ExtraProperties) => (response: AxiosResponse): AxiosResponse => {
  console.log('run ConsoleResponseInterceptor 2')

  return response
}

export default ConsoleResponseInterceptor2
