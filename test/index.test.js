const chai = require('chai');
const chaiHttp = require('chai-http');
const app = require('../index.js');

chai.use(chaiHttp);
chai.should();

describe("Route", () => {
  it("Rate limit", (done) => {
    // Max 60
    for (var index = 0; index < 60; index++) {
      chai.request(app)
        .get('/web/dcard')
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.be.a('object');
        });
    }
    // Over request times 61
    chai.request(app)
      .get('/web/dcard')
      .end((err, res) => {
        res.should.have.status(429);
        res.body.should.be.a('object');
      });

    // WINDOW_MS change to 1000ms 
    // setTimeout(() => {
    //   chai.request(app)
    //     .get('/web/dcard')
    //     .end((err, res) => {
    //       res.should.have.status(200);
    //       res.body.should.be.a('object');
    //     });
    done();
    // }, 1100)
  });

  it("Url not found", (done) => {
    chai.request(app)
      .get('/test')
      .end((err, res) => {
        res.should.have.status(404);
        res.body.should.be.a('object');
      });
    done();
  });
});