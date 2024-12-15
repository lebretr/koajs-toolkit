
const Koa = require('koa')
    , app = new Koa()
    , Router = require('@koa/router')
    , router = new Router(),
    // { httpServerLib, proxyMid } = require('@lebretr/koajs-toolkit')
    { httpServerLib, proxyMid } = require('../../index')
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
    "protocol": "https",
    "hostname":"www.google.com",
    "port": 443,
    // "rejectUnauthorized": false,
    "headers": {
        //add header
        // "X-AuthToken":"LFK2-0KFKDOKEK-22093JLSKDJ-100"
    }
};

let proxy=proxyMid(conf)

app.use(async (ctx,next)=>{
    try{
        logger.info('app use');
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

router.get('/hello', (ctx, next) => {
    ctx.body = 'Hello World!';
});

router.get('/google', async (ctx, next) => {
    ctx.proxyLibUrl='/';
    await proxy(ctx);
});

app.use(router.routes())
    .use(router.allowedMethods())

let app_conf={
    "domain": "localhost",
    "http": {
        "port": 8080
    },
    "https": {
        "version": "1.1",
        "port": 8443,
        "options": {
            "key": "./Exemples/httpServerLib/certs/key.pem",
            "cert": "./Exemples/httpServerLib/certs/cert.pem",
            "ca": "./Exemples/httpServerLib/certs/ca/minica.pem",
            "allowHTTP1":true
        }
    }
};

httpServerLib.serve(app, app_conf, logger);