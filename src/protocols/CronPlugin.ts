
import { processWithMutableState } from "./common"
import { TigerPlugin, BaseResolver, Tiger, ExtendedHandler } from "../tiger";

import nodeCron = require("node-cron");
export class CronPlugin implements TigerPlugin  {
  /**
   * cron protocol
   */
  id: string = "cron";  
  
  setup(tiger: Tiger): void {
    tiger.register(new class extends BaseResolver<object, object> {
      readonly protocol: string = "cron";
      define(path: string, id: string, handler: ExtendedHandler<object, object>) {
        nodeCron.schedule(path, function() {
          processWithMutableState(handler, {});
        })
      }
    });
  }
}
