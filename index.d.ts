import * as Router from 'koa-router';
import {Application} from "thinkjs";

interface RouterPlus extends Router {
  namespace(prefix: string, ...middlewares: ((ctx: Context, next: () => Promise<any>) => any)[]): Router;
}

declare module "think-router-plus" {
  export let router: (options: any, app: Application) => Router.IMiddleware;
  export let nextController: (controller: string, action?: string, module?: string) => Router.IMiddleware;
}
