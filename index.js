"use strict";
const compose = require("koa-compose");
const RouterPlusClass = require("./router");
const debug = require('debug')('think-router-plus');
const methods = require('methods');

const defaultOptions = {
  defaultModule: 'home',
  defaultController: 'index',
  defaultAction: 'index',
  enableDefaultRouter: true,
  optimizeHomepageRouter: true,
  denyModules: [],
};

function nextController (controller, action, module) {
  return (ctx, next) => {
    ctx.module = module || defaultOptions.defaultModule;
    ctx.controller = controller || defaultOptions.defaultController;
    ctx.action = action || defaultOptions.defaultAction;
    debug(`RouterParser: path=${ctx.path}, controller=${ctx.controller}, action=${ctx.action}, module=${ctx.module}}`);
    return next();
  };
}

function parseController (pathname, controllersALL) {
  let controller = '';
  for (const name of Object.keys(controllersALL)) {
    if (name.indexOf('/') === -1) {
      break;
    }
    if (name === pathname || pathname.indexOf(`${name}/`) === 0) {
      controller = name;
      pathname = pathname.slice(name.length + 1);
      break;
    }
  }
  return { controller, pathname };
}

const defaultRouter = (ctx, next, app, opts) => {
  const isMultiModule = app.modules.length;
  if ((isMultiModule && !ctx.module) || !ctx.controller || !ctx.action) {
    let pathname = ctx.path || "";
    if (opts.optimizeHomepageRouter && (pathname === '' || pathname === '/')) {
      const module = isMultiModule ? opts.defaultModule : '';
      const controllerStr = opts.defaultController;
      const actionStr = opts.defaultAction;
      return nextController(controllerStr, actionStr, module)(ctx, next);
    }
    pathname = pathname.replace(/^\/|\/$/g, '').replace(/\/{2,}/g, '/');
    let m = '';
    let controllers = app.controllers;
    if (app.modules.length) {
      const pos = pathname.indexOf('/');
      m = pos === -1 ? pathname : pathname.slice(0, pos);
      if (app.modules.indexOf(m) > -1 && m !== 'common' && opts.denyModules.indexOf(m) === -1) {
        pathname = pos === -1 ? '' : pathname.slice(pos + 1);
      }
      else {
        m = opts.defaultModule;
      }
      controllers = controllers[m] || {};
    }
    let controller = '';
    const parseControllerResult = parseController(pathname, controllers);
    controller = parseControllerResult.controller;
    pathname = parseControllerResult.pathname;
    let action = '';
    const pathnameArr = pathname.split('/');
    if (controller) {
      action = pathnameArr[0];
    }
    else {
      controller = pathnameArr[0];
      action = pathnameArr[1];
    }
    return nextController(controller, action, m)(ctx, next);
  }
  return next();
}

function ThinkRouterPlus (options, app) {
  const opts = Object.assign({}, defaultOptions, options);
  const routerOpts = Object.assign({}, opts.router);
  const allowedOpts = Object.assign({}, opts.allowed);
  const router = new RouterPlusClass(routerOpts);
  app.routers.forEach((fn) => {
    fn(router, app);
  });

  if (opts.enableDefaultRouter) {
    router.all('*', (ctx, next) => {
      return defaultRouter(ctx, next, app, opts);
    });
  }

  return (ctx, next) => {
    if (ctx.method && methods.includes(ctx.method.toLowerCase())) {
      return compose([
        router.routes(),
        router.allowedMethods(allowedOpts),
        (ctx2, next2) => {
          ctx2.param(ctx2.params);
          return next2();
        }
      ])(ctx, next);
    } else {
      return defaultRouter(ctx, next, app, opts);
    }
  };
}

exports.nextController = nextController;
exports.router = ThinkRouterPlus;
