
import { processWithMutableState } from "./common"
import { TigerPlugin, Tiger, ExtendedModule } from "../tiger";
import { BaseResolver } from "../resolver"

import nodeCron = require("node-cron");
export default new class implements TigerPlugin  {
  /**
   * cron protocol
   */
  id: string = "cron";  
  
  setup(tiger: Tiger): void {
    tiger.register(new class extends BaseResolver<object, object> {
      readonly protocol: string = "cron";
      define(path: string, _module: ExtendedModule<object, object>) {
        nodeCron.schedule(path, function() {
          processWithMutableState(_module, {});
        })
      }
    });
  }
}
