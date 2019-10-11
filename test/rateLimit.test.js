const redis = require('./__mocks__/redis');

jest.setMock('ioredis', redis);

const rateLimit = require('@lib/rateLimit');

describe('Rate limit',()=>{
    it('Request get', async () =>{
        const result = await rateLimit('192.168.1.1');
        expect(result).toBe(1);
    });

    it('TOO MANY REQUESTS', async () =>{
        const result = await rateLimit('192.168.1.2');
        expect(result).toBe('TOO_MANY_REQUESTS');
    });

    it('incr', async () =>{
        const result = await rateLimit('192.168.1.3');
        expect(result).toBe(3);
    });
})
