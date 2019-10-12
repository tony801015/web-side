# Web server side for nodejs
This web server side, provide very good middleware like the `rate-limit`.

# Getting Started

## Prerequisites
- Install [Nodejs](https://nodejs.org/dist/v8.12.0/node-v8.12.0.pkg) (8.12.0 LTS) for OS X  
- Install [docker](https://docs.docker.com/docker-for-mac/install/) for OS X


## Installing
Install Dependencies packages
```
npm install
```

# Usage
Before starting, ran redis by docker. Use reids to record IP, requestTimes and expire time on the `rate-limit`.
```
npm start
```
Open browser [http://127.0.0.1:3000/web/dcard](http://127.0.0.1:3000/web/dcard)
## For develop
```
npm run dev
```
## Running the tests
Unit test - test rateLimit.js in the lib.
```
npm test
```
e2e test - test server up and running.
```
npm run e2e
```
# Directory structure

```bash
├── README.md
├── app.js
├── config
│   ├── index.js
│   └── route.json
├── controller
│   ├── Controller.js
│   └── WebController.js
├── lib
│   └── rateLimit.js
├── middleware
│   └── RateLimitBuilder.js
├── package-lock.json
├── package.json
├── script
│   └── redis.sh
└── tests
    ├── __mocks__
    │   └── redis.js
    ├── e2e
    │   └── index.test.js
    └── lib
        └── rateLimit.test.js
```
## app.js
程式的主要執行檔，初始化與設定解析格式、建構路由等等。此檔可以透過Controller和Middleware來達到路由的建置，甚至可以方便抽換路由所需要的Middleware。
```js
const webRouter = WebController.build(
  RateLimitBuilder.build, // RateLimit功能
  DcardBuilder.build  // Dcard功能
  ...
);
app.use('/web', webRouter);
app.use('*', (req, res) => {
  res.status(404).send({
    code: 999999,
    message: 'Url not found.',
  });
});
```

## controller
在Controller裡，定義路由和邏輯，因此設計一個父類別`Controller`，主要是建構`路由`和`中介器`，讓未來需要開發其他種類的實作，可以透過`Controller`統一處理，像是這裡建構了一個`WebController`，只需要繼承Controller而實作callback方法，就可以完成route了。
```js
static build(...middleware) {
  const router = express.Router();
  apiRoute.routes.forEach((route) => {
    router[route.httpMethod.toLowerCase()](
      route.urlPath,
      ...middleware,
      this.callback.bind(route),
    );
  });
```
## middleware
在進入路由前處理請求，實作上只需注意要把request, response, next作為entrypoint的參數
```js
static async build(req, res, next) {
    req.count = await rateLimit(req.ip);
    next();
}
```
- RateLimitBuilder  
此middleware也如同檔名一樣，是提供呼叫API時的限制，此實作是透過redis來記錄呼叫次數(REQUEST_TIMES)以及限制時間(WINDOW_MS)。  
`lib/rateLimit.js`
  ```js
  async function rateLimit(ip){
      const requestTimes = await redis.get(ip);
      if(requestTimes === null){
          await redis.set(ip,1,'ex',WINDOW_MS)
          return redis.get(ip);
      } 
      if(requestTimes >= REQUEST_TIMES_MAX){
          return 'TOO_MANY_REQUESTS';
      }
      return redis.incr(ip);
  }
  ```
  ※ 為何使用redis來實作rateLimit  
  1. 在考量到未來水平擴充時，如果是in-memory，打到不同的伺服器，這樣在紀錄requestTime時，就會無法精準記錄呼叫次數，而透過redis可以統一存放資訊，而在未來擴充也相對方便很多。  
  2. 在redis提供的功能中，可以方便算出總數和過期資料移除的功能。


## lib
在程式裡需要的自定義的套件，像是目前與rateLimit套件，需要使用只需require即可。

## config
config資料夾中分成兩種類型格式的檔案，第一種設定檔，第二種路由配置，設定檔會放置一些程式需要配置的環境變數，而路由配置會依照http方法和路徑建構出來，未來可以透過相同的格式方便新增API路徑。
- 設定檔
```js
module.exports = {
  WINDOW_MS: 60,
  REQUEST_TIMES_MAX: 60,
  REDIS: {
    HOST: '127.0.0.1',
    PORT: '6379',
    PASSWORD: '',
  }
};
```
- 路由
```json
[
    {
      "httpMethod": "get",
      "urlPath": "/dcard"
    }
]
```

# Built With
* [Express](http://expressjs.com/) - The web framework used

