
import { processWithMutableState } from "./common"
import { TigerPlugin, BaseResolver, Tiger, Handler } from "../tiger";

import nodeCron = require("node-cron");
export class CronPlugin implements TigerPlugin  {
  /**
   * cron protocol
   */
  id: string = "cron";  
  
  setup(tiger: Tiger): void {
    tiger.register(new class extends BaseResolver<object> {
      readonly protocol: string = "cron";
      define(path: string, id: string, handler: Handler<object>) {
        nodeCron.schedule(path, function() {
          processWithMutableState(tiger, handler, id, {});
        })
      }
    });
  }
}
