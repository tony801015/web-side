require('module-alias/register');

const express = require('express');
const app = express();
const WebController = require('@controller/WebController');
const RateLimitBuilder = require('@middleware/RateLimitBuilder');

const webRouter = WebController.build(
  RateLimitBuilder.build,
);
app.use('/web', webRouter);
app.use('*', (req, res) => {
  res.status(404).send({
    code: 999999,
    message: 'Url not found.',
  });
});

const port = process.env.PORT || 3000;
app.listen(port);

module.exports = app;