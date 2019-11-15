
import { ExtendedHandler } from "../tiger"

export function processWithMutableState<Param, State>(handler: ExtendedHandler<Param, State>, param: Param) {
  const state = handler.state();

  const result = handler.process.call(handler, state, param)
  if (result) {
    handler.state({ ...state, ...result });
  }
}
