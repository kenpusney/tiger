
import { processWithMutableState } from "./common"
import { TigerPlugin, BaseResolver, Tiger, Handler } from "../tiger";

import nodeCron = require("node-cron");
/**
 * Cron plugin
 * @description Usage: tiger.define("cron:<cron syntax>")
 */
export class CronPlugin implements TigerPlugin  {
  /**
   * cron protocol
   */
  id: string = "cron";  
  
  setup(tiger: Tiger): void {
    tiger.register(new class extends BaseResolver<object> {
      readonly protocol: string = "cron";
      define(path: string, id: string, processor: Handler<object>) {
        nodeCron.schedule(path, function() {
          processWithMutableState(tiger, processor, id, {});
        })
      }
    });
  }
}
