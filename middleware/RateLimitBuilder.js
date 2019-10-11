const rateLimit = require('@lib/rateLimit');

class RateLimitBuilder {
  static async build(req, res, next) {
      req.count = await rateLimit(req.ip);
      next();
  }
}

module.exports = RateLimitBuilder;
