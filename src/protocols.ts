import nodeCron = require("node-cron");

import express = require("express");

import cors = require('cors');

import { Tiger, Handler, BaseResolver, TigerPlugin } from "./tiger"

function processWithMutableState<Param>(tiger: Tiger, processor: Handler<Param>, id: string, param: Param) {
  const state = tiger.state(id)

  const result = processor.processor(tiger, state, param)

  tiger.state(id, {...state, ...result});
}

class CronPlugin implements TigerPlugin  {
  id: string = "cron";  
  
  setup(tiger: Tiger): void {
    tiger.register(new class extends BaseResolver<object> {
      readonly protocol: string = "cron";
      define(path: string, id: string, processor: Handler<object>) {
        nodeCron.schedule(path, function() {
          processWithMutableState(tiger, processor, id, {});
        })
      }
    });
  }
}

class HttpPlugin implements TigerPlugin {
  id: string = "http";
  private _server = express();
  
  setup(tiger: Tiger): void {
    const server = this._server;
    server.use(cors())
  
    tiger.register(new class extends BaseResolver<object> {
      readonly protocol: string = "http";
      define(path: string, id: string, processor: Handler<object>) {
        server.get(path, (req, res) => {
          processWithMutableState(tiger, processor, id, {req, res})
        })
      }
    })
  
    process.nextTick(() => {
      server.listen(9527);
    });
  }
}

class MailPlugin implements TigerPlugin {
  id: string = "mail";  

  setup(tiger: Tiger): void {
    tiger.register(new class extends BaseResolver<object> {
      readonly protocol: string = "mail"
      notify(target: string, param: object, tiger: Tiger) {
        console.log(`sending email to ${target} ${param}`)
      }
    });
  }
}

const cron = new CronPlugin();
const http = new HttpPlugin();
const mail = new MailPlugin();

export {
  cron, http, mail
}