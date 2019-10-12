const supertest = require('supertest');
const app = require('@root/app');
const http = require('http');
const Redis = require('ioredis');
const { REDIS } = require('@config/index')
const redis = new Redis({
    host: REDIS.HOST,
    port: REDIS.PORT,
})

describe('Rate limit',()=>{
    beforeAll(async (done) => {
      server = http.createServer(app);
      server.listen(done);
      request = supertest(server);
      await redis.del('::ffff:127.0.0.1');
    });
    
    afterAll((done) => {
      server.close(done);
    });
    
    it('returns 404', async () => {
      const response = await request.get('/');
      expect(response.status).toBe(404);
    });

    it('Request', async () =>{
        const result = await request.get('/web/dcard');
        expect(result.status).toBe(200);
    })

    it('Request', async () =>{
        let result;
        for (let i =0; i < 60; i++){
            result = await request.get('/web/dcard');
        }
        expect(result.status).toBe(429);
    })
})
