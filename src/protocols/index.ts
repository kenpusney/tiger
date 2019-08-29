
import { CronPlugin } from "./CronPlugin"
import { HttpPlugin } from "./HttpPlugin"
import { MailPlugin } from "./MailPlugin"

const cron = new CronPlugin();
const http = new HttpPlugin();
const mail = new MailPlugin();

export {
  /**
   * cron plugin
   */
  cron, 
  /**
   * http plugin
   */
  http, 
  /**
   * mail plugin
   */
  mail
}