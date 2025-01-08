
const Koa = require('koa')
    , app = new Koa()
    // , { apiKeyCheckMid } = require('@lebretr/koajs-toolkit')
    , { httpServerLib, apiKeyCheckMid } = require('../../../index.js')
    , logger={
        error: function(...args){
            console.error(...args);
        },
        debug: function(...args){
            console.error(...args);
        },
        warning: function(...args){
            console.log(...args);
        },
        info: function(...args){
            console.log(...args);
        },
        verbose: function(...args){
            console.log(...args);
        },
        silly: function(...args){
            console.log(...args);
        }
    }
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

    let conf={
        header:'x-apikey',
        keys:['AJG94H-FJ9-IEBWNVU7493BEJ1-8433']
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

    app.use(new apiKeyCheckMid(conf));

    app.use(async (ctx,next)=>{
        ctx.logger.verbose('log something during DO SOMETHING');
        // DO SOMETHING
        await next();
    });


    app.use(async (ctx,next)=>{
        ctx.logger.verbose('log something before send response');
        ctx.body={ 'status':200, ctx_uuid: ctx.uuid };
    });

    let app_conf={
        'domain': 'localhost',
        'http': {
            'port': 8080
        },
        'https': {
            'version': '1.1',
            'port': 8443,
            'options': {
                'key': './certs/key.pem',
                'cert': './certs/cert.pem',
                'ca': './certs/ca/minica.pem',
                'allowHTTP1':true
            }
        }
    };

    new httpServerLib(app, app_conf, logger);
})();