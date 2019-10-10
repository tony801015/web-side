# Web server side for nodejs
This web server side, provide very good middleware like the `rate-limit`.

# Getting Started

## Prerequisites
Install Nodejs(8.12.0 LTS) for OS X
```
https://nodejs.org/dist/v8.12.0/node-v8.12.0.pkg
```

## Installing
Install Dependencies packages
```
npm install
```

# Usage
```
npm start
```
Open browser [http://127.0.0.1:3000/web/dcard](http://127.0.0.1:3000/web/dcard)
## For develop
```
npm run dev
```
## Running the tests
```
npm test
```
# Directory structure

### Source Code
├─── index.js  
├─── config  
│   ├──── index.js  
│   └──── webRoute.json  
├─── controller  
│   ├──── Controller.js  
│   └──── WebController.js  
├─── middleware  
│   └──── RateLimitBuilder.js  
└─── test  
    └───── index.test.js 

### index
程式的主要檔案，在建構路由時，透過Controller和Middleware來達到路由的建置，甚至可以方便抽換路由所需要的Middleware。
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

### controller
在Controller裡，設計一個父類別`Controller`，主要是建構`路由`和`中介器`，讓未來需要開發其他種類的實作，可以透過`Controller`統一處理，像是這裡建構了一個`WebController`，只需要繼承Controller而實作callback方法，就可以完成route了。
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
### middleware
實作上只需注意要把request, response, next作為entrypoint的參數
```js
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
```
- RateLimitBuilder  
  此middleware也如同檔名一樣，是提供呼叫API時的限制，首先建置了一個`dataStore`，作為存IP的地方，這裡會依據config的設定來做限制，`WINDOW_MS`時間區間和`REQUEST_TIMES`呼叫次數，因此`dataStore`會判斷IP是否第一次進入，如果第一次就會記錄呼叫次數為`1`並且會紀錄重置的時間，如果是第二次開始的IP會遞增呼叫次數。
  ```js
  // Record request times
  if (requestCount[ip]) {
    requestCount[ip]++;
  } else {
    requestCount[ip] = 1;
    resetTime[ip] = dataResetTime();
  }
  ```
  接下來開始就會判斷，是否超過重置的時間，如果超過就會把重置時間重新設定，並把呼叫次數設定為`1`
  ```js
  // Time out reset 
  const date = new Date();
  if (date > resetTime[ip]) {
    resetTime[ip] = dataResetTime();
    requestCount[ip] = 1;
  }
  ```
  但在重置的時間區間內，呼叫次數已經達到設定的最大值時，就會拋出一個`Error`訊息
  ```js
  // Over request times
  if (requestCount[ip] > REQUEST_TIMES_MAX) {
    throw Error('Too many requests');
  }
  ```

### config
config資料夾中分成兩種類型格式的檔案，第一種設定檔，第二種路由，設定檔會放置一些程式需要配置的變數，而路由會依照http方法和路徑建構出來，未來可以透過相同的格式方便新增API路徑。
```json
[
    {
      "httpMethod": "get",
      "urlPath": "/dcard"
    }
]
```

## Built With
* [Express](http://expressjs.com/) - The web framework used

