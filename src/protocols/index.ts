
import { CronPlugin } from "./CronPlugin"
import { HttpPlugin } from "./HttpPlugin"
import { MailPlugin } from "./MailPlugin"
import { ExamplePlugin } from "./ExamplePlugin";
import { ZmqPlugin } from "./ZqmPlugin";

const cron = new CronPlugin();
const http = new HttpPlugin();
const mail = new MailPlugin();
const example = new ExamplePlugin();
const zmq = new ZmqPlugin();

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
  mail,
  
  example,
  zmq
}