
import {Tiger, Handler} from "../tiger"

export function processWithMutableState<Param>(tiger: Tiger, handler: Handler<Param>, id: string, param: Param) {
  const state = tiger.state(id)

  const result = handler.process.call(handler, tiger, state, param)

  tiger.state(id, {...state, ...result});
}
