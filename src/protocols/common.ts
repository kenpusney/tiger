
import {Tiger, ExtendedHandler} from "../tiger"

export function processWithMutableState<Param, State>(handler: ExtendedHandler<Param, State>, param: Param) {
  const state = handler.state();

  const result = handler.process.call(handler, state, param)

  handler.state({...state, ...result});
}
