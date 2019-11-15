
const { Tiger, http, cron, mail } = require("../lib")

const tiger = new Tiger({});

tiger.use(http)
tiger.use(cron)

tiger.use(mail)

tiger.define({ target: "cron:*/5 * * * * *", process(tiger, { count = 0 }) {
  count++;
  this.notify("mail:someone@another.com", { subject: "hello", text: "hello world", html: "<p>hello world</p>" });
  return { count }
}});

tiger.define({ id: "request", target: "http:/hello", process: function (tiger, state, { req, res }) {
  this.notify("mail:someone@another.com", { subject: "hello", text: "hello world", html: "<p>hello world</p>" });
  res.send("success!")
}})

tiger.serve();
