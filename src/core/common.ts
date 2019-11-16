
import { ExtendedModule } from "../tiger"
import { getLogger } from "log4js";

const logger = getLogger("state")

export function processWithMutableState<Param, State>(_module: ExtendedModule<Param, State>, param: Param) {
  const state = _module.state() as any as object;

  const result = _module.process.call(_module, state, param)
  if (result) {
    logger.info(`Patch state of ${_module.id} with ${JSON.stringify(result)}`)
    _module.state({ ...state, ...result });
  }
}
