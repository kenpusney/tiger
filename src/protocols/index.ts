
import { CronPlugin } from "./CronPlugin"
import { HttpPlugin } from "./HttpPlugin"
import { MailPlugin } from "./MailPlugin"
import { ExamplePlugin } from "./ExamplePlugin";
import { ZmqPlugin } from "./ZmqPlugin";

const cron = new CronPlugin();
const http = new HttpPlugin();
const mail = new MailPlugin();
const example = new ExamplePlugin();
const zmq = new ZmqPlugin();

export {
  cron, 
  http, 
  mail,  
  example,
  zmq
}