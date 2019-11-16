import { TigerPlugin, Tiger } from "../tiger";
import { BaseResolver } from "../resolver"
import { Logger, getLogger } from "log4js";
const mailer = require("nodemailer")

interface MailParam {
  subject: string
  text: string
  html: string
}

export default new class implements TigerPlugin {
  id: string = "mail";  
  _logger: Logger = getLogger("mail")

  setup(tiger: Tiger): void {
    const logger = this._logger;
    const config = tiger.config.mail

    const transport = mailer.createTransport(config.transport);

    tiger.register(new class extends BaseResolver<MailParam, object> {
      readonly protocol: string = "mail"
      notified(target: string, param: MailParam) {
        logger.info(`Sending mail to ${target}: ${JSON.stringify(param)}`)
        const option = { from: config.sender, to: target, ...param }
        transport.sendMail(option)
      }
    });
  }
}