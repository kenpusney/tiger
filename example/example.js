
const { Tiger, http, cron, mail } = require("../lib")

const tiger = new Tiger({});

tiger.use(http)
tiger.use(cron)

tiger.use(mail)

tiger.define("cron", { target: "cron:*/5 * * * * *", processor: function (tiger, { count = 0 }) {
  count++;
  console.log("hello");
  tiger.notify("mail:someone@another.com", { subject: "hello", text: "hello world", html: "<p>hello world</p>" });
  return { count }
}});

tiger.define("request", { target: "http:/hello", processor: function (tiger, state, { req, res }) {

  tiger.notify("mail:someone@another.com", { subject: "hello", text: "hello world", html: "<p>hello world</p>" });

  res.send("success!")
}})

tiger.serve();
