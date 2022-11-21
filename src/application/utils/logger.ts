import winston from "winston";
import current_date from "./current_date";

class Logger {
  private route: string;
  public logger: winston.Logger;
  constructor(route: string) {
    this.route = route;
    const logger = winston.createLogger({
      level: "info",
      format: winston.format.printf((info) => {
        let message = `${current_date()} || ${info.level} || ${info.message}`;
        message = info.obj
          ? `${message} || ${JSON.stringify(info.obj)}`
          : message;
        return message;
      }),
      transports: [
        new winston.transports.Console(),
        new winston.transports.File({ filename: `./log / ${route}.log` }),
      ],
    });
    this.logger = logger;
  }

  // info
  async info(message: string) {
    this.logger.log("info", message);
  }
  async infoWithObject(message: string, obj: any) {
    this.logger.log("info", message, { obj });
  }
  // error
  async error(message: string) {
    this.logger.log("error", message);
  }
  async errorWithObject(message: string, obj: any) {
    this.logger.log("error", message, { obj });
  }
  // debug
  async debug(message: string) {
    this.logger.log("debug", message);
  }
  async debugWithObject(message: string, obj: any) {
    this.logger.log("debug", message, { obj });
  }
}

export = Logger;
