
const { Tiger, http, cron, mail, example, zmq } = require("../lib")

const tiger = new Tiger({
  mail: {
    sender: "sender@example.com",
    transport: {
      host: "smtp.example.com",
      port: 465,
      secure: true,
      auth: {
        user: "sender@example.com",
        pass: "password"
      }
    },

    channel: "mail:someone@another.com"
  }
});

tiger.use(http)
tiger.use(cron)
tiger.use(example)
tiger.use(mail)
tiger.use(zmq)

tiger.define({
  target: "example:hello",
  process({ max = 0 }) {
    const {  number } = this.state();

    if (number < max) {
      this.log("Continue");
    }
  }
})

tiger.define({
  target: "cron:*/5 * * * * *",
  process({ count = 0 }) {
    count++;
    // this.notify("mail:someone@another.com", {
    //   subject: "hello",
    //   text: "hello world",
    //   html: "<p>hello world</p>"
    // });
    this.notify("zmq:hello", {message: "hello world"});
    this.notify("example:hello", { max: count });
    return { count }
  }
});

tiger.define({
  id: "request",
  target: "http:/hello",
  process: function (state, { req, res }) {
    res.send("success!")
  }
});

tiger.define({
  target: "zmq:hello",
  process(state, message) {
    this.log(JSON.stringify(message))
  }
})

tiger.serve();
