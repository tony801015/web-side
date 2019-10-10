const Controller = require('@controller/Controller');

class WebController extends Controller {
  static callback(req, res) {
    res.status(200).send({
      requestTimes: req.count
    });
  }
}

module.exports = WebController;
