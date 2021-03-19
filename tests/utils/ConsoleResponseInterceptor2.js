const ConsoleResponseInterceptor2 = (options) => (response) => {
  console.log('run ConsoleResponseInterceptor 2')

  return response
}

export default ConsoleResponseInterceptor2
