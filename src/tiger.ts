
import { Logger, getLogger } from  "log4js"

export interface Resolver<Param> {
  define(path: string, id: string, handler: Handler<Param>): void
  notify(path: string, param: Param, tiger: Tiger): void
}

export class BaseResolver<Param> implements Resolver<Param> {
  define(path: string, id: string, handler: Handler<Param>): void {}
  notify(path: string, param: Param, tiger: Tiger): void {}
}

interface TigerConfig {}

export interface Handler<Param> {
  target: string,
  processor(tiger: Tiger, state: object, param: Param): object
}

export interface Plugin {}

export class Tiger {


  config: TigerConfig
  _plugins: { [key: string]: Plugin }
  _tigs: { [key: string]: Handler<any> }
  _resolvers: { [key: string]: Resolver<any> }
  _state: { [key: string]: object }
  _logger: Logger

  constructor(config = {}) {
    this.config = config;
    this._plugins = {};
    this._tigs = {};
    this._resolvers = {};
    this._state = {};

    this._logger = getLogger("tiger");
    this._logger.level = "INFO";
  }

  use(plugin: (tiger: Tiger)=>void) {
    plugin(this);
  }

  define<Param>(id: string, handler: Handler<Param>) {
    this._tigs[id] = handler;

    const target = handler.target
    const processor = handler
    const targetDef = target.split(":");
    const protocol = targetDef[0]
    const path = targetDef[1]

    const resolver = this._resolvers[protocol]

    if (resolver && resolver.define) {
      resolver.define(path, id, processor);
    } else {
      this.warn(`No valid definition handler found for protocol [${protocol}]`)
    }
  }

  notify<Param>(target: string, param: Param) {
    this.log(`Notifying target: ${target} with param ${param}`)

    const targetDef = target.split(":")
    const protocol = targetDef[0];
    const path = targetDef[1]
    const resolver = this._resolvers[protocol]

    if (resolver && resolver.notify) {
      resolver.notify(path, param, this)
    } else {
      this.warn(`No valid notification handler found for protocol [${protocol}]`)
    }
  }

  register<Param>(protocol, resolver: Resolver<Param>): void {
    this._resolvers[protocol] = resolver;
  }

  state(key: string, value?: object): object {
    if (value) {
      this._state[key] = value
    } else {
      return (this._state[key] || {})
    }
  }


  serve() {

  }

  log(log, scope = "") {
    this._logger.info(`${scope ? scope + " -- " : ""}${log}`);
  }
  error(log, scope = "") {
    this._logger.error(`${scope ? scope + " -- " : ""}${log}`);
  }
  warn(log, scope = "") {
    this._logger.warn(`${scope ? scope + " -- " : ""}${log}`);
  }
}
