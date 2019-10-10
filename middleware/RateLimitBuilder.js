const { WINDOW_MS, REQUEST_TIMES_MAX } = require('@config')
const requestCount = {};
const resetTime = {};

/**
 * Generate data reset time
 */
function dataResetTime() {
  const date = new Date();
  date.setMilliseconds(date.getMilliseconds() + WINDOW_MS);
  return date;
}

/**
 * Data store
 * @param {string} ip - req.ip
 * @returns {object} requestCount
 */
function dataStore(ip) {
  // Record request times
  if (requestCount[ip]) {
    requestCount[ip]++;
  } else {
    requestCount[ip] = 1;
    resetTime[ip] = dataResetTime();
  }

  // Time out reset 
  const date = new Date();
  if (date > resetTime[ip]) {
    resetTime[ip] = dataResetTime();
    requestCount[ip] = 1;
  }

  // Over request times
  if (requestCount[ip] > REQUEST_TIMES_MAX) {
    throw Error('Too Many Requests');
  }

  return requestCount[ip];
}

class RateLimitBuilder {
  static build(req, res, next) {
    try {
      req.count = dataStore(req.ip);
      next();
    } catch (error) {
      res.status(429).send({
        message: 'Too Many Requests',
      });
    }
  }
}

module.exports = RateLimitBuilder;
