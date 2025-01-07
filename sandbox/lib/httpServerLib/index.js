
import Koa from 'koa';
import { v4 as uuidv4 } from 'uuid';
// import { httpServerLib, loggerLib } from  '@lebretr/koajs-toolkit';
import { httpServerLib, loggerLib } from  '../../../index.js';

const app = new Koa()
    // , logger={
    //     error: function(...args){
    //         console.error(...args)
    //     },
    //     info: function(...args){
    //         console.log(...args)
    //     },
    //     debug: function(...args){
    //         console.debug(...args)
    //     }
    // }
    ;

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