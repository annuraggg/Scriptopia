class logger {
  info(message: string) {
    const date = new Date();
    console.log(
      `\x1b[37m[${date.toISOString()}] \x1b[32mINFO: \x1b[34m${message} \x1b[37m`
    );
  }

  error(message: string) {
    console.error(
      `\x1b[37m[${new Date().toISOString()}] \x1b[31mERROR: \x1b[31m${message} \x1b[37m`
    );
    console.trace();
  }

  warn(message: string) {
    console.warn(
      `\x1b[37m[${new Date().toISOString()}] \x1b[33mWARN: \x1b[33m${message} \x1b[37m`
    );
  }
}

export default new logger();
