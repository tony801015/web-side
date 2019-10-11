const { WINDOW_MS, REQUEST_TIMES_MAX, REDIS } = require('@config/index')
const Redis = require('ioredis');
const redis = new Redis({
    host: REDIS.HOST,
    port: REDIS.PORT,
})

/**
 * Data store
 * @param {string} ip - req.ip
 * @returns {object} requestCount
 */
async function rateLimit(ip){
    const requestTimes = await redis.get(ip);
    if(requestTimes === null){
        await redis.set(ip,1,'ex',WINDOW_MS)
        return redis.get(ip);
    } 
    if(requestTimes >= REQUEST_TIMES_MAX){
        // TODO: i18n
        return 'TOO_MANY_REQUESTS';
    }
    return redis.incr(ip);
}

module.exports = rateLimit;