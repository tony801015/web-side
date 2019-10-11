const Controller = require('@controller/Controller');

class WebController extends Controller {
  static callback(req, res) {
    if(req.count==='TOO_MANY_REQUESTS'){
      res.status(429).send({
        // TODO: i18n
        message: 'Too Many Requests'
      });
    } else {
      res.status(200).send({
        requestTimes: req.count
      });
    }
  }
}

module.exports = WebController;
