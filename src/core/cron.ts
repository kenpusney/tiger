
import { processWithMutableState } from "./common"
import { TigerPlugin, Tiger, ExtendedModule } from "../tiger";
import { BaseResolver } from "../resolver"

import nodeCron = require("node-cron");
import { Logger, getLogger } from "log4js";

export default new class implements TigerPlugin  {
  /**
   * cron protocol
   */
  id: string = "cron";  
  
  _logger: Logger = getLogger("cron")

  setup(tiger: Tiger): void {
    const logger = this._logger
    logger.info("initializing cron plugin")
    tiger.register(new class extends BaseResolver<object, object> {
      readonly protocol: string = "cron";
      define(path: string, _module: ExtendedModule<object, object>) {
        logger.info(`creating schedule [${path}] on module ${_module.id}`)
        nodeCron.schedule(path, function() {
          logger.info(`invoking job ${_module.id} with schedule ${path}`)
          processWithMutableState(_module, {});
        })
      }
    });
  }
}
