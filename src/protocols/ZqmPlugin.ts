
import { TigerPlugin, Tiger, ExtendedModule } from "../tiger";
import { BaseResolver } from "../resolver"

import { processWithMutableState } from "./common";
import { socket } from "zeromq/v5-compat"


export class ZmqPlugin implements TigerPlugin  {
  /**
   * cron protocol
   */
  id: string = "zmq";  
  
  setup(tiger: Tiger): void {
    const publisher = socket("pub")
    publisher.bind("tcp://0.0.0.0:9528");
    tiger.register(new class extends BaseResolver<object, object> {

      readonly protocol: string = "zmq";

      subscribe(topic) {
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

      notified(path: string, param, next?: (path: string, param: object) => void) {
        publisher.send([path, JSON.stringify(param)])
      }
    });
  }
}
