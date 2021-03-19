const ConsoleResponseInterceptor1 = (options) => (response) => {
  console.log('run ConsoleResponseInterceptor 1')

  return response
}

export default ConsoleResponseInterceptor1
