
import * as express from "express";

export type State = { [key: string]: State | any };

export type TigerMethod = "get" | "put" | "post" | "delete" | "options" | "head" | "patch" | "all";

export type Server = express.Express;

export type Request = express.Request;

export type Response = express.Response;

export interface TigerModule {
  method: TigerMethod,
  state?: State,
  handler: (req: Request, res: Response, state?: State) => boolean
}

export interface Tiger {
  serve(basePath: string): void
  config(configurer: (server: Server) => void): void
  port(port: number): void
}

export interface StateManager {
  set(key: string, value: State): State
  get(key: string): State
  mount(server: Server): void
}

export type LoaderResult = { status: boolean, path: string }
