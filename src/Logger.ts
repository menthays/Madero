export enum Level {
  error,
  warn,
  info,
  verbose,
  debug,
  silly
}

export enum LevelString {
  error = "error",
  warn = "warn",
  info = "info",
  verbose = "verbose",
  debug = "debug",
  silly = "silly"
}

export interface LoggerConfig {
  level: Level;
  label?: string;
  labelStyle?: {
    bgColor: string;
    color: string;
  };
  displayTs?: boolean;
  displayStack?: boolean;
  transports: Array<(...args: string[]) => void>
}

export default class Logger {
  private config: LoggerConfig;
  private logArgs: Array<(() => string[]) | Symbol>;
  private originLog: Symbol;
  constructor(config: Partial<LoggerConfig>) {
    this.config = Object.assign({}, {
      level: Level.debug,
      transports: [
        console.log
      ]
    }, config);
    this.logArgs = [];
    this.originLog = Symbol("origin");
    if (config.label) {
      this.logArgs.push(() => this.genLabel(this.config.label, this.config.labelStyle));
    }
    if (config.displayTs) {
      this.logArgs.push(this.genTs);
    }
    this.logArgs.push(this.originLog);
    if (config.displayStack) {
      this.logArgs.push(this.genStack);
    }
  }

  private genLabel(
    label?: string,
    labelStyle?: {
      bgColor: string;
      color: string;
    }
  ) {
    if (!label) {
      return [""];
    }

    if (!labelStyle) {
      return [label];
    } else {
      return [
        `%c ${label}`,
        `background: ${labelStyle.bgColor}; color: ${
          labelStyle.color
        }`
      ];
    }
  }

  private genTs() {
    return [`${new Date().toUTCString()}`];
  }

  private genStack() {
    return [`\n${new Error().stack}`];
  }

  private printf(level: LevelString, content: string) {
    let args: string[] = [];
    for (let item of this.logArgs) {
      if (item === this.originLog) {
        args = args.concat([level, content]);
      } else {
        args = args.concat((item as () => string[])());
      }
    }
    for (let fn of this.config.transports) {
      fn(...args)
    }
  }

  public error(content: string) {
    if(this.config.level < Level.error) {
      return;
    }
    return this.printf(LevelString.error, content);
  }

  public warn(content: string) {
    if(this.config.level < Level.warn) {
      return;
    }
    return this.printf(LevelString.warn, content);
  }

  public info(content: string) {
    if(this.config.level < Level.info) {
      return;
    }
    return this.printf(LevelString.info, content);
  }

  public verbose(content: string) {
    if(this.config.level < Level.verbose) {
      return;
    }
    return this.printf(LevelString.verbose, content);
  }

  public debug(content: string) {
    if(this.config.level < Level.debug) {
      return;
    }
    return this.printf(LevelString.debug, content);
  }

  public silly(content: string) {
    if(this.config.level < Level.silly) {
      return;
    }
    return this.printf(LevelString.silly, content);
  }
}
