import * as express from "express";
export declare type State = {
    [key: string]: State | any;
};
export declare type TigerMethod = "get" | "put" | "post" | "delete" | "options" | "head" | "patch" | "all";
export declare type Server = express.Express;
export declare type Request = express.Request;
export declare type Response = express.Response;
export interface TigerModuleDef {
    method: TigerMethod;
    state?: State;
    handler: (req: Request, res: Response, state?: State) => boolean;
}
export interface Tiger {
    serve(basePath: string): void;
    config(configurer: (server: Server) => void): void;
    port(port: number): void;
}
export interface StateManager {
    set(key: string, value: State): State;
    get(key: string): State;
    mount(server: Server): void;
}
export interface TigerModule {
    name: string;
    moduleDef?: TigerModuleDef;
}
export interface ModuleRegistry {
    update(module: string, moduleDef: TigerModuleDef): TigerModule;
    unload(module: string): TigerModule;
    valid(module: string): boolean;
}
export declare type LoaderResult = {
    status: boolean;
    path: string;
};
