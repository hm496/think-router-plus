import * as Router from 'koa-router';

interface RouterPlus extends Router {
  namespace(prefix: string, ...middlewares: ((ctx: Context, next: () => Promise<any>) => any)[]): Router;
}

type nextController = (controller: string, action?: string, module?: string) => Router.IMiddleware;

declare module "think-router-plus" {
  export let RouterPlus: RouterPlus;
  export let nextController: nextController;
}
