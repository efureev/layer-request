const ConsoleResponseInterceptor2 = (options, extra) => (response) => {
  console.log('run ConsoleResponseInterceptor 2')

  return response
}

export default ConsoleResponseInterceptor2
