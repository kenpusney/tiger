const zeromq = require("zeromq")

const nodeCron = require("node-cron")

const express = require("express")

const cors = require('cors')

const mailer = require("nodemailer")


const processWithMutableState = function(tiger, processor, id, param) {
  const state = tiger.state(id)

  const result = processor(tiger, state, param)

  tiger.state(id, Object.assign({}, state, result));
}

const zmq = function(tiger) {

  const publisher = zeromq.socket("pub")
  publisher.bindSync("tcp://0.0.0.0:9528")

  const subscribe = function(topic) {
    const subscriber = zeromq.socket("sub")
    subscriber.subscribe(topic)
    subscriber.connect("tcp://0.0.0.0:9528")
    return subscriber;
  }

  const resolver = {
    define(path, id, processor) {
      const sub = subscribe(path)
      sub.on("message", (topicBuf, messageBuf) => {
        const topic = topicBuf.toString();
        if (topic === path) {
          const message = JSON.parse(messageBuf.toString())
          processWithMutableState(tiger, processor, id, message)  
        } else {
          tiger.log(`Skipped with inexact match ${topic} of ${path}`)
        }
      });
    },

    notify(target, param) {
      tiger.log(`Notifiying Queue ${target} with param ${param}`)
      publisher.send([target.toString(), JSON.stringify(param)])
    }
  }

  tiger.register("zmq", resolver)
}

const cron = function(tiger) {
  const resolver = {
    define(path, id, processor) {
      nodeCron.schedule(path, function() {
        processWithMutableState(tiger, processor, id, {});
      })
    }
  }

  tiger.register("cron", resolver)
}

const http = function(tiger) {

  const server = express()

  server.use(cors())

  const resolver = {
    define(path, id, processor) {
      server.get(path, (req, res) => {
        processWithMutableState(tiger, processor, id, {req, res})
      })
    }
  }

  tiger.register("http", resolver)

  tiger.serve = function() {
    server.listen(9527)
  }
}


const mail = function(tiger) {


  const config = tiger.config.mail;

  if (!config || !config.transport) {
    tiger.error("No proper email config found, exit!", "mail protocol")
    process.exit(-1)
  }

  const transport = mailer.createTransport(config.transport);

  const resolver = {
    notify(target, param) {
      const options = Object.assign({}, { from: config.sender, to: target }, param);

      transport.sendMail(options)
    }
  }

  tiger.register("mail", resolver)
}

module.exports = {
  zmq, cron, http, mail
}