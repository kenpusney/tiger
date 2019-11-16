
import { TigerPlugin, Tiger, ExtendedModule } from "../tiger";
import { BaseResolver } from "../resolver"

import { processWithMutableState } from "./common";
import { socket } from "zeromq/v5-compat"
import { Logger, getLogger } from "log4js";


export default new class implements TigerPlugin  {
  /**
   * cron protocol
   */
  id: string = "zmq";  
  _logger: Logger = getLogger("zmq")
  
  setup(tiger: Tiger): void {
    const publisher = socket("pub")
    const logger = this._logger;
    logger.info("init zmq plugin")

    publisher.bind("tcp://0.0.0.0:9528");
    tiger.register(new class extends BaseResolver<object, object> {

      readonly protocol: string = "zmq";

      subscribe(topic) {
        logger.info(`create subscriber for topic [${topic}]`)
        const subscriber = socket("sub");
        subscriber.connect("tcp://0.0.0.0:9528")
        subscriber.subscribe(topic)
        return subscriber;
      }

      registry: { [key: string]: ExtendedModule<object, object> } = {};

      define(path: string, _module: ExtendedModule<object, object>) {
        const sub = this.subscribe(path)
        sub.on("message", (topicBuf, messageBuf) => {
          if (topicBuf.toString() === path) {
            const message = JSON.parse(messageBuf.toString());
            processWithMutableState(_module, message)
          }
        })
      } 

      notified(path: string, param) {
        logger.info(`message received on channel [${path}]: ${JSON.stringify(param)}`)
        publisher.send([path, JSON.stringify(param)])
      }
    });
  }
}
