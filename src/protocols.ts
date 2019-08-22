import nodeCron = require("node-cron");

import express = require("express");

import cors = require('cors');

import { Tiger, Handler, BaseResolver } from "./tiger"

function processWithMutableState<Param>(tiger: Tiger, processor: Handler<Param>, id: string, param: Param) {
  const state = tiger.state(id)

  const result = processor.processor(tiger, state, param)

  tiger.state(id, {...state, ...result});
}

const cron = function(tiger: Tiger) {
  tiger.register("cron", new class extends BaseResolver<object> {
    define(path: string, id: string, processor: Handler<object>) {
      nodeCron.schedule(path, function() {
        processWithMutableState(tiger, processor, id, {});
      })
    }
  })
}

const http = function(tiger: Tiger) {

  const server = express()

  server.use(cors())

  tiger.register("http", new class extends BaseResolver<object> {
    define(path: string, id: string, processor: Handler<object>) {
      server.get(path, (req, res) => {
        processWithMutableState(tiger, processor, id, {req, res})
      })
    }
  })

  tiger.serve = function() {
    server.listen(9527)
  }
}


const mail = function(tiger) {
  tiger.register("mail", new class extends BaseResolver<object> {
    notify(target: string, param: object, tiger: Tiger) {
      console.log(`sending email to ${target} ${param}`)
    }
  })
}

export {
  cron, http, mail
}