import { TigerPlugin, BaseResolver, Tiger, Handler } from "../tiger";
import { processWithMutableState } from "./common"

import express = require("express");
import cors = require("cors");

export class HttpPlugin implements TigerPlugin {
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