const Koa = require('koa')
    , app = new Koa()
    , app2 = new Koa()
    , httpServerLib = require('../../../lib/httpServerLib.js')
    , request = require('supertest')
    // , { httpServerLib } = require('@lebretr/koajs-toolkit')
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

(async()=>{
    // const { loggerLib } = require('@lebretr/koajs-toolkit');
    //or import { loggerLib } from  '@lebretr/koajs-toolkit';
    const loggerLib = require('../../../lib/loggerLib.js');

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
    let conf2={
        "domain": "localhost",
        "http": {
            "port": 8080
        }
    };


    app.use(async (ctx,next)=>{
        ctx.body={ 'status':200 };
    });


    app2.use(async (ctx,next)=>{
        ctx.body={ 'status':200 };
    });

    // new httpServerLib(app, conf, logger);

    let server  = new httpServerLib(app, conf, logger);

    server && server.httpServerListenReady.then(async()=>{
        let agent = request.agent(server.httpServer);
        const response = await agent.get('/');
        server && server.httpServer && server.httpServer.close();
    })

    let server2  = new httpServerLib(app2, conf2, logger);

    server2 && server2.httpServerListenReady.then(async()=>{
        let agent = request.agent(server2.httpServer);
        const response = await agent.get('/');
        server2 && server2.httpServer && server2.httpServer.close();
    }).catch(async(err)=>{
        console.log(err);
        let agent = request.agent(server2.httpServer);
        const response = await agent.get('/');
        server2 && server2.httpServer && server2.httpServer.close();
    })

    // new httpServerLib(app, conf2, logger);
})();