
import {Tiger, Handler} from "../tiger"

export function processWithMutableState<Param>(tiger: Tiger, processor: Handler<Param>, id: string, param: Param) {
  const state = tiger.state(id)

  const result = processor.processor(tiger, state, param)

  tiger.state(id, {...state, ...result});
}
