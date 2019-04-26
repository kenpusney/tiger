
const { mail } = require("../protocols")

const tiger = require("../index")({
  mail: {
    sender: "email@example.com",
    transport: {
      host: "some.smtp.server.com",
      port: 465,
      secure: true,
      auth: {
        user: "email@example.com",
        pass: "password"
      }
    }
  }
})

tiger.use(mail)

tiger.define("hello", ["zmq:hello", function (tiger, state, message) {
  tiger.log(`Message received: ${JSON.stringify(message)}`)
}])

tiger.define("cron", ["cron:*/5 * * * * *", function (tiger, { count = 0 }) {
  count++;
  tiger.notify("zmq:hello", { count })
  return { count }
}]);

tiger.define("request", ["http:/hello", function (tiger, state, { req, res }) {

  tiger.notify("mail:someone@another.com", { subject: "hello", text: "hello world", html: "<p>hello world</p>" });

  res.send("success!")
}])

tiger.serve();
