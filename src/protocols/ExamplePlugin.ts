
import { TigerPlugin, Tiger, ExtendedModule } from "../tiger";
import { BaseResolver } from "../resolver"

export class ExamplePlugin implements TigerPlugin  {
  /**
   * cron protocol
   */
  id: string = "example";  
  
  setup(tiger: Tiger): void {
    tiger.register(new class extends BaseResolver<{ max: number }, { number: number }> {
      readonly protocol: string = "example";

      registry: { [key: string]: ExtendedModule<{ max: number }, { number: number }> } = {};

      define(path: string, _module: ExtendedModule<{ max: number }, { number: number }>) {
        if (!this.registry[path]) {
          this.registry[path] = _module;
        }
      } 

      notified(path: string, param, next?: (path: string, param: object) => void) {
        if (this.registry[path]) {
          const { max  = 0 } = param;
          const _module = this.registry[path];
          const state = _module.state();
          const { number = 0 } = state
          if (number < max) {
            this.run(_module, state, param, number)
            next(`${this.protocol}:${path}`, param)
          } else {
            this.reset(_module)
          }
        }
      }

      reset(_module) {
        _module.state({number: 0})
      }

      run(_module, state, param, number) {
        _module.process(state, param)
        _module.state({number: number + 1})
      }
    });
  }
}
