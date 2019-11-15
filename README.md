# tiger-server

<img src="./docs/1024px-Ghostscript_Tiger.png" width="250" height="250"/>

Tiger server is a very lightweight server for very simple process like webhooks.

## Usage

```
npm install tiger-server --save
```

and create `server.js`:
```js

const { Tiger, http, cron, mail } = require("tiger-server")

const tiger = new Tiger({});

tiger.use(http)
tiger.use(cron)

tiger.use(mail)

tiger.define({ id: "hello", target: "zmq:hello", process: function (state, message) {
  tiger.log(`Message received: ${JSON.stringify(message)}`)
}})


tiger.define({ id: "cron", target: "cron:*/5 * * * * *", process: function ({ count = 0 }) {
  count++;
  tiger.notify("zmq:hello", { count })
  return { count }
}});

tiger.define({ id: "request", target: "http:/hello", process: function (state, { req, res }) {
  tiger.notify("zmq:hello", { message: "request recieved" });

  res.send("success!")
}})

tiger.serve();
```

Just run `node server.js` then you can now see these modules interactions.


> Logo is generated from [Wikipedia](https://en.wikipedia.org/wiki/File:Ghostscript_Tiger.svg), the original script is under GPL license.