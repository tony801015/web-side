const express = require('express');
const apiRoute = require('@config/route');

class Controller {
  /**
   * Build router through mapping file.
   */
  static build(...middleware) {
    const router = express.Router();
    apiRoute.routes.forEach((route) => {
      router[route.httpMethod.toLowerCase()](
        route.urlPath,
        ...middleware,
        this.callback.bind(route),
      );
    });

    return router;
  }
}

module.exports = Controller;
