
const Koa = require('koa')
    , app = new Koa()
    // , { apiKeyCheckMid } = require('@lebretr/koajs-toolkit')
    , { httpServerLib, apiKeyCheckMid } = require('../../index')
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

app.use(apiKeyCheckMid(conf));

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