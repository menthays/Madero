function socketTransport (id: string) {
  // @ts-ignore
  let buffer = window[`socketTransport${id}`]
  if (!buffer) {
    // @ts-ignore
    buffer = window[`socketTransport${id}`] = {
      size: 0,
      arr: [],
      maxSize: 2048
    }
  }
  return (...args: string[]) => {
    let str = args.join(' ')
    if (buffer.size + str.length > buffer.maxSize) {
      
    }
  }
}

