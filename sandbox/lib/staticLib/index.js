
import Koa from 'koa';
import request from 'supertest'
import koatool from  '../../../index.js';

const app = new Koa()
    , staticLib=koatool.staticLib
    , httpServerLib=koatool.httpServerLib
    , logger={
        error: function(m){
            console.error(m);
        },
        info: function(m){
            console.log(m);
        }
    }
    ;

let conf={
    '/' : './Exemples/staticLib/public'
};

// (async function(){
    await new staticLib(app, conf);


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

    let server  = new httpServerLib(app, app_conf, logger);

    server && server.httpServerListenReady.then(async()=>{
        let agent = request.agent(server.httpServer);
        const response = await agent.get('/');
        server && server.httpServer && server.httpServer.close();
    }).catch(async(err)=>{
        console.log(err);
        let agent = request.agent(server.httpServer);
        const response = await agent.get('/');
        server && server.httpServer && server.httpServer.close();
    });

// })();