import { TigerPlugin, Tiger } from "../tiger";
import { BaseResolver } from "../resolver"

export default new class implements TigerPlugin {
  id: string = "mail";  

  setup(tiger: Tiger): void {
    tiger.register(new class extends BaseResolver<object, object> {
      readonly protocol: string = "mail"
      notified(target: string, param: object) {
        console.log(`sending email to ${target} ${param}`)
      }
    });
  }
}