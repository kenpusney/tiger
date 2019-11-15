import { TigerPlugin, Tiger, BaseResolver } from "../tiger";

export class MailPlugin implements TigerPlugin {
  id: string = "mail";  

  setup(tiger: Tiger): void {
    tiger.register(new class extends BaseResolver<object, object> {
      readonly protocol: string = "mail"
      notify(target: string, param: object) {
        console.log(`sending email to ${target} ${param}`)
      }
    });
  }
}