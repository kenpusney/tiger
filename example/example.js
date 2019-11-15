
const { Tiger, http, cron, mail, basic } = require("../lib")

const tiger = new Tiger({});

tiger.use(http)
tiger.use(cron)
tiger.use(basic)
tiger.use(mail)

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
    // count++;
    // this.notify("mail:someone@another.com", {
    //   subject: "hello",
    //   text: "hello world",
    //   html: "<p>hello world</p>"
    // });
    // return { count }
    this.notify("example:hello", { max: 10 });
  }
});

tiger.define({
  id: "request",
  target: "http:/hello",
  process: function (state, { req, res }) {
    this.notify("mail:someone@another.com", {
      subject: "hello",
      text: "hello world",
      html: "<p>hello world</p>"
    });
    res.send("success!")
  }
});

tiger.serve();
