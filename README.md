## egg-router-plus for Thinkjs
forked from [egg-router-plus](https://github.com/eggjs/egg-router-plus) 1.3.0

### mount RouterPlus
```typescript
// src/config/middleware.ts
import {router} from 'think-router-plus';

export = [
  '...other middlewares',
  {
    handle: router,
    options: {
        defaultModule: 'home', // default thinkjs Module
        defaultController: 'index', // default thinkjs Controller
        defaultAction: 'index', // default thinkjs Action
        enableDefaultRouter: true,  // enable default thinkjs router
        optimizeHomepageRouter: true, // optimize homepage Router
        denyModules: [], // deny Modules
        router: {}, // new Router(options.router)
        allowed: {}, // router.allowedMethods(options.allowed)
    }
  },
  'controller'
];
```

## Features
### router.namespace
```typescript
// src/config/router.ts
import {Application} from "thinkjs";
import {RouterPlus, nextController} from 'think-router-plus';

export = [
  (router: RouterPlus, app: Application) => {
    const subRouter = router.namespace('/proxy');
    subRouter.all('/api/:url*', nextController("index", "index"));
    // nextController("controller", "action", "module")
  }
];
```

### types
```typescript
import * as Router from 'koa-router';
import {Application} from "thinkjs";

interface RouterPlus extends Router {
  namespace(prefix: string, ...middlewares: ((ctx: Context, next: () => Promise<any>) => any)[]): Router;
}

declare module "think-router-plus" {
  export let router: (options: any, app: Application) => Router.IMiddleware;
  export let nextController: (controller: string, action?: string, module?: string) => Router.IMiddleware;
}
```
