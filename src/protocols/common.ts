
import { ExtendedModule } from "../tiger"

export function processWithMutableState<Param, State>(_module: ExtendedModule<Param, State>, param: Param) {
  const state = _module.state();

  const result = _module.process.call(_module, state, param)
  if (result) {
    _module.state({ ...state, ...result });
  }
}
