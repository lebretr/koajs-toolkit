# koajs-toolkit

## loggerLib

peerDependencies:

``` bash
npm install --save winston@3.x
```

in your index.js:

``` js
const { loggerLib } = require('@lebretr/koajs-toolkit')
    ;

let conf={
    "level": "info",
    "gg_stackdriver": false, // True if you publish your app on GCP
    "console": {
        "silent": false,
        "colorize": true
    },
    "file":{
        "filename": "combined.log"
    }
};

await loggerLib.loggerConfigAsync(conf);
const logger=loggerLib.logger;
logger.error(new Error('I am an error'));
logger.debug(new Error('Debug me!'));
logger.warning('/!\\/!\\/!\\ Yeah /!\\/!\\/!\\');
...
```

## httpServerLib

``` js
const Koa = require('koa')
    , app = new Koa()
    , { httpServerLib } = require('@lebretr/koajs-toolkit')
    , logger={
        error: function(m){
            console.error(m)
        },
        info: function(m){
            console.log(m)
        }
    }
    ;

let conf={
    "domain": "localhost",
    "http": {
        "port": 8080
    },
    "https": {
        "version": "1.1",
        "port": 8443,
        "options": {
            "key": "certs/key.pem",
            "cert": "certs/cert.pem",
            "ca": "certs/ca/minica.pem",
            "allowHTTP1":true
        }
    }
};

httpServerLib.serve(app, config, logger);
...
```

Note for logger:  
You can use winston lib or other lib with error and info function.  
If you don't set any logger, we will use the [debug](https://www.npmjs.com/package/debug) lib. So the DEBUG environment variable is then used to enable debugging log. example: DEBUG="koajs-toolkit:httpServerLib" or DEBUG="koajs-toolkit:*"  

## proxyLib

install peerDependencies:

``` bash
npm install --save cookie@^0.4.0
```

in your index.js:

``` js
const Koa = require('koa')
    , app = new Koa()
    , koaBody = require('koa-body')
    , Router = require('koa-router')
    , router = new Router(),
    { proxyLib } = require('@lebretr/koajs-toolkit')
    ;

let conf={
    "protocole": "https",
    "hostname":"dist.server.com",
    "port": 8443,
    // "rejectUnauthorized": false,
    "headers": {
        //add header
        // "X-AuthToken":"LFK2-0KFKDOKEK-22093JLSKDJ-100"
    }
};

router.use(proxyLib(config));

app.use(router.routes())
    .use(router.allowedMethods());
...
```

## proxyLib



in your index.js:

``` js
const Koa = require('koa')
    , app = new Koa()
    { apiKeyCheckLib } = require('@lebretr/koajs-toolkit')
    ;

let conf={
    header:'x-apikey',
    keys:["AJG94H-FJ9-IEBWNVU7493BEJ1-8433"]
};


app.use(async (ctx,next)=>{
    try{
        await next();
    }catch(e){
        ctx.status=e.status || 500;

        let message='Internal Server Error';
        if(ctx.status!==500){
            message=e.message;
        }

        ctx.body={ 'code':ctx.status, message };
    }
});

app.use(apiKeyCheckLib(config));
...
```

if apikey sended in header is not valid, then apiKeyCheckLib throw an Error with:  
error.status=401  
error.message='Unauthorized'  
