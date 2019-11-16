import { Extension } from "./tiger";

interface MailConfig {
  sender: string
  channel: string
  transport: {
    host: string
    port: number
    secure: boolean
    auth: {
      user: string
      pass: string
    }
  }
}

export interface TigerConfig {
  mail?: MailConfig 
}

interface Processor<Param, State, Module> {
  (this: Module & Extension<Param, State>, state: State, param: Param): object | void
}
export interface Module<Param, State> {
  id?: string
  readonly target: string
  readonly process: Processor<Param, State, this>
}

export interface Target {
  readonly protocol: string
  readonly path: string
}
