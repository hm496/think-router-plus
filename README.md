## egg-router-plus for Thinkjs
forked from [egg-router-plus](https://github.com/eggjs/egg-router-plus) 1.3.0

### mount RouterPlus
```typescript
// src/config/middleware.ts
import {RouterPlus} from 'think-router-plus';

export = [
  '...other middlewares',
  {
    handle: RouterPlus,
    options: {
        defaultModule: 'home', // default thinkjs Module
        defaultController: 'index', // default thinkjs Controller
        defaultAction: 'index', // default thinkjs Action
        enableDefaultRouter: true,  // enable default thinkjs router
        optimizeHomepageRouter: true, // optimize homepage Router
        denyModules: [], // deny Modules
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

interface RouterPlus extends Router {
  namespace(prefix: string, ...middlewares: ((ctx: Context, next: () => Promise<any>) => any)[]): Router;
}

type nextController = (controller: string, action?: string, module?: string) => Router.IMiddleware;

declare module "think-router-plus" {
  export let RouterPlus: RouterPlus;
  export let nextController: nextController;
}
```
