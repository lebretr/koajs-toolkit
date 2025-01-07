# koajs-toolkit

## httpServerLib

``` js
const Koa = require('koa')
    , app = new Koa()
    , { httpServerLib } = require('@lebretr/koajs-toolkit')
    , logger={
        error: function(...args){
            console.error(...args)
        },
        info: function(...args){
            console.log(...args)
        }
    }
    ;

let conf={
    "domain": "localhost",
    "http": {
        "port": 8080
    },
    "https": {
        "version": "1.1", // "1.1" to use http module or "2" to use http2 module
        "port": 8443,
        "options": { // See https://nodejs.org/api/http2.html#http2createsecureserveroptions-onrequesthandler or https://nodejs.org/api/http.html#httpcreateserveroptions-requestlistener
            "key": "certs/key.pem",
            "cert": "certs/cert.pem",
            "ca": "certs/ca/minica.pem",
            "allowHTTP1":true
        }
    }
};



app.use(async (ctx,next)=>{
    ctx.body="Hello world!";
});

httpServerLib.serve(app, conf, logger);
...
```

Note for logger:  
You can use winston lib or other lib with error and info function.  
If you don't set any logger, we will use the [debug](https://www.npmjs.com/package/debug) lib. So the DEBUG environment variable is then used to enable debugging log. example: DEBUG="koajs-toolkit:httpServerLib" or DEBUG="koajs-toolkit:*"  

## loggerLib

``` bash
npm install --save @lebretr/koajs-toolkit
```

peerDependencies:

``` bash
npm install --save winston@3.x
```

If you deploy on GCP, add this dependence:

``` bash
npm install --save '@google-cloud/logging-winston'
```

in your index.js:

``` js
const { loggerLib } = require('@lebretr/koajs-toolkit');

let conf={
    "level": "info",
    "gg_stackdriver": false, // True if you publish your app on GCP. 
    "console": {
        "silent": false,
        "colorize": true
    },
    "file":{
        "filename": "combined.log"
    }
};

(async()=>{
    const logger=await new loggerLib.Logger(conf);
    logger.error(new Error('I am an error'));
    logger.debug(new Error('Debug me!'));
    logger.warn('/!\\/!\\/!\\ Yeah /!\\/!\\/!\\');
})();
...
```

or:
``` js
import { loggerLib } from  '@lebretr/koajs-toolkit';

let conf={
    "level": "info",
    "gg_stackdriver": false, // True if you publish your app on GCP. 
    "console": {
        "silent": false,
        "colorize": true
    },
    "file":{
        "filename": "combined.log"
    }
};

const logger=await new loggerLib.Logger(conf);
logger.error(new Error('I am an error'));
logger.debug(new Error('Debug me!'));
logger.warn('/!\\/!\\/!\\ Yeah /!\\/!\\/!\\');
...
```

or:
``` js
const { loggerLib } = require('@lebretr/koajs-toolkit');

let conf={
    "level": "info",
    "gg_stackdriver": false, // True if you publish your app on GCP. 
    "console": {
        "silent": false,
        "colorize": true
    },
    "file":{
        "filename": "combined.log"
    }
};

loggerLib.LoggerAsync(conf).then((logger)=>{
    logger.error(new Error('I am an error'));
    logger.debug(new Error('Debug me!'));
    logger.warn('/!\\/!\\/!\\ Yeah /!\\/!\\/!\\');
});
...
```

In your other js files, to use the already configured logger, use ```getLogger``` method:

``` js
const { loggerLib } = require('@lebretr/koajs-toolkit');
//or import { loggerLib } from  '@lebretr/koajs-toolkit';

const logger=loggerLib.getLogger();

logger.error(new Error('I am an error'));
logger.debug(new Error('Debug me!'));
logger.warn('/!\\/!\\/!\\ Yeah /!\\/!\\/!\\');
...
```

If you want to use several loggers, add name when you instanciate a logger:

``` js
const { loggerLib } = require('@lebretr/koajs-toolkit');
//or import { loggerLib } from  '@lebretr/koajs-toolkit';

let conf={
    "level": "silly",
    "file":{
        "filename": "combined.log"
    }
};

let conf2={
    "level": "info",
    "console": {
        "silent": false,
        "colorize": true
    },
};

(async()=>{

    const logger=await new loggerLib.Logger(conf,'file');

    const logger2=await new loggerLib.Logger(conf2,'secondlog');

    logger.error(new Error('I am an error'));
    logger2.error(new Error('I am an error'));
})();
...
```

In your other js files, to use the already configured loggers, use their names:


``` js
const { loggerLib } = require('@lebretr/koajs-toolkit');
//or import { loggerLib } from  '@lebretr/koajs-toolkit';

const logger=loggerLib.getLogger('file');
const logger2=loggerLib.getLogger('secondlog');

logger.error(new Error('I am an error'));
logger2.error(new Error('I am an error'));
...
```

You can also contextualize your log. For example, having a "context information" as an "request uid" each time you log something in kao.js, express.js or others:
``` js
const Koa = require('koa')
    , app = new Koa()
    , { v4 : uuidv4 } = require('uuid')
    , { httpServerLib, loggerLib } = require('@lebretr/koajs-toolkit')
    ;

(async()=>{
    let confL={
        "level": "silly",
        "gg_stackdriver": false, // True if you publish your app on GCP. 
        "console": {
            "silent": false,
            "colorize": true
        },
        "file":{
            "filename": "combined.log"
        }
    };

    const logger=await new loggerLib.Logger(confL);

    let conf={
        "domain": "localhost",
        "http": {
            "port": 8080
        },
        "https": {
            // "version": "1.1",
            "version": "2",
            "port": 8443,
            "options": {
                "key": "certs/key.pem",
                "cert": "certs/cert.pem",
                "ca": "certs/ca/minica.pem",
                "allowHTTP1":true
            }
        }
    };

    app.use(async (ctx,next)=>{
        ctx.uuid=uuidv4();
        ctx.logger=new loggerLib.LoggerForContext(logger, ctx.uuid);
        next();
    });


    app.use(async (ctx,next)=>{
        ctx.logger.verbose('log something during DO SOMETHING');
        // DO SOMETHING
        next();
    });


    app.use(async (ctx,next)=>{
        ctx.logger.verbose('log something before send response');
        ctx.body={ 'status':200, ctx_uuid: ctx.uuid };
    });

    new httpServerLib(app, conf, logger);
})();
```

## proxyMid

install peerDependencies:

``` bash
npm install --save cookie@^0.4.0
```

in your index.js:

``` js
const Koa = require('koa')
    , app = new Koa()
    , Router = require('koa-router')
    , router = new Router(),
    { proxyMid } = require('@lebretr/koajs-toolkit')
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

router.use(proxyMid(config));

app.use(router.routes())
    .use(router.allowedMethods());
...
```

## apiKeyCheckMid

in your index.js:

``` js
const Koa = require('koa')
    , app = new Koa()
    { apiKeyCheckMid } = require('@lebretr/koajs-toolkit')
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

app.use(apiKeyCheckMid(config));
...
```

if apikey sended in header is not valid, then apiKeyCheckMid throw an Error with:  
error.status=401  
error.message='Unauthorized'  

## staticLib

install peerDependencies:

``` bash
npm install --save koa@2.x koa-mount@4.x
```

in your index.js:

``` js
const Koa = require('koa')
    , app = new Koa()
    , { staticLib } = require('@lebretr/koajs-toolkit')
    ;

let conf={
    "/" : "./public"
};

await staticLib(app, conf);
...
```
