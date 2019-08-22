
import { Logger, getLogger } from  "log4js"

export interface Resolver<Param> {
  readonly protocol: string
  define(path: string, id: string, handler: Handler<Param>): void
  notify(path: string, param: Param, tiger: Tiger): void
}

export abstract class BaseResolver<Param> implements Resolver<Param> {
  abstract readonly protocol: string
  define(path: string, id: string, handler: Handler<Param>): void {}
  notify(path: string, param: Param, tiger: Tiger): void {}
}

interface TigerConfig {}

type Processor<Param> = (tiger: Tiger, state: object, param: Param) => object

export interface Handler<Param> {
  readonly target: string
  readonly processor: Processor<Param>
}

type TigerCall = (tiger: Tiger) => void

export interface Plugin {
  readonly id: string;
  readonly setup: TigerCall
}

export class Tiger {

  readonly config: TigerConfig
  private _plugins: { [key: string]: Plugin }
  private _tigs: { [key: string]: Handler<any> }
  private _resolvers: { [key: string]: Resolver<any> }
  private _state: { [key: string]: object }
  private _logger: Logger

  private _postInitializeProcesses: Array<TigerCall>

  constructor(config = {}) {
    this.config = config;
    this._plugins = {};
    this._tigs = {};
    this._resolvers = {};
    this._state = {};

    this._logger = getLogger("tiger");
    this._logger.level = "INFO";
    this._postInitializeProcesses = [];
  }

  use(plugin: (tiger: Tiger) => void) {
    plugin(this);
  }

  usePlugin(plugin: Plugin) {
    if (this._plugins[plugin.id] !== undefined) {
      this._plugins[plugin.id] = plugin;
      plugin.setup(this)
    } else {
      this.warn(`Existed plugin: ${plugin.id}`)
    }
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

  register<Param>(resolver: Resolver<Param>): void {
    this._resolvers[resolver.protocol] = resolver;
  }

  state(key: string, value?: object): object {
    if (value) {
      this._state[key] = value
    } else {
      return (this._state[key] || {})
    }
  }

  serve() {
    this._postInitializeProcesses.forEach(it => {
      it(this);
    })
  }

  log(log: string, scope?: string) {
    this._logger.info(`${scope ? scope + " -- " : ""}${log}`);
  }
  error(log: string, scope?: string) {
    this._logger.error(`${scope ? scope + " -- " : ""}${log}`);
  }
  warn(log: string, scope?: string) {
    this._logger.warn(`${scope ? scope + " -- " : ""}${log}`);
  }
}
