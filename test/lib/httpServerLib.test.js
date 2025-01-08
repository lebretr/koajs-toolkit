'use strict';

process.env.DEBUG = 'koajs-toolkit:*';
process.env.NODE_TLS_REJECT_UNAUTHORIZED = 0; 

const httpServerLib = require('../../lib/httpServerLib.js');
const Koa = require('koa')
    , request = require('supertest')
    ;

let httpPort=8080
  , httpsPort=8443
  ;

describe('lib/httpServerLib.js', () => {
    test('httpServerLib Test', async () => {
        expect(1===1).toBe(true);
    });


    test('httpServerLib initialisation with empty conf', async () => {
        let app = new Koa();
        let conf={
        };
        app.use(async (ctx,next)=>{
            ctx.body={ 'status':ctx.status };
        });
        let server  = new httpServerLib(app, conf);
        server && await server.httpServerListenReady.then(()=>{
            server && server.httpServer && server.httpServer.close();
        });
        server && await server.httpsServerListenReady.then(()=>{
            server && server.httpsServer && server.httpsServer.close();
        });
    });


    test('httpServerLib initialisation with conf mono file', async () => {
        let app = new Koa();
        let conf={
            'domain': 'localhost',
            'http': {
                'port': httpPort++
            },
            'https': {
                // "version": "1.1",
                'version': '2',
                'port': httpsPort++,
                'options': {
                    'key': 'certs/key.pem',
                    'cert': 'certs/cert.pem',
                    'ca': 'certs/ca/minica.pem',
                    'allowHTTP1':true
                }
            }
        };
        app.use(async (ctx,next)=>{
            ctx.body={ 'status': 200 };
        });
        let server  = new httpServerLib(app, conf);
        server && await server.httpServerListenReady.then(async()=>{
            let agent = request.agent(server.httpServer);
            const response = await agent.get('/');
            console.log(response);
            expect(response.statusCode).toBe(200);
            expect(response.body.status).toBe(200);
            server && server.httpServer && server.httpServer.close();
        });
        server && await server.httpsServerListenReady.then(async()=>{
            let agent = request.agent(server.httpsServer);
            const response = await agent.get('/');
            console.log(response);
            expect(response.statusCode).toBe(200);
            expect(response.body.status).toBe(200);
            server && server.httpsServer && server.httpsServer.close();
        });
    });


    test('httpServerLib initialisation with conf multi file', async () => {
        let app = new Koa();
        let conf={
            'domain': 'localhost',
            'http': {
                'port': httpPort++
            },
            'https': {
                // "version": "1.1",
                'version': '2',
                'port': httpsPort++,
                'options': {
                    'key': 'certs/key.pem',
                    'cert': 'certs/cert.pem',
                    'ca': ['certs/ca/minica.pem','certs/ca/minica_2.pem'],
                    'allowHTTP1':true
                }
            }
        };
        app.use(async (ctx,next)=>{
            ctx.body={ 'status': 200 };
        });
        let server  = new httpServerLib(app, conf);
        server && await server.httpServerListenReady.then(async()=>{
            let agent = request.agent(server.httpServer);
            const response = await agent.get('/');
            console.log(response);
            expect(response.statusCode).toBe(200);
            expect(response.body.status).toBe(200);
            server && server.httpServer && server.httpServer.close();
        });
        server && await server.httpsServerListenReady.then(async()=>{
            let agent = request.agent(server.httpsServer);
            const response = await agent.get('/');
            console.log(response);
            expect(response.statusCode).toBe(200);
            expect(response.body.status).toBe(200);
            server && server.httpsServer && server.httpsServer.close();
        });
    });


    // test('httpServerLib http port alreadyused', async () => {
    //     let app = new Koa()
    //     let app2 = new Koa()
    //     let conf={
    //         "domain": "localhost",
    //         "http": {
    //             "port": httpPort++
    //         }
    //     };
    //     app.use(async (ctx,next)=>{
    //         ctx.body={ 'status': 200 };
    //     });
    //     app2.use(async (ctx,next)=>{
    //         ctx.body={ 'status': 200 };
    //     });
    //     let server  = new httpServerLib(app, conf);
    //     let server2  = new httpServerLib(app2, conf);
    //     server && await server.httpServerListenReady.then(async()=>{
    //         let agent = request.agent(server.httpServer);
    //         const response = await agent.get('/');
    //         console.log(response.statusCode)
    //         expect(response.statusCode).toBe(200);
    //         expect(response.body.status).toBe(200);


    //         server2 && await server2.httpServerListenReady.then(async()=>{
    //             expect(1).toBe(0);
    //             server2 && server2.httpServer && server2.httpServer.close();
    //             server && server.httpServer && server.httpServer.close();
    //         }).catch(async(err)=>{
    //             expect(err.code).toBe('EADDRINUSE');
    //             server2 && server2.httpServer && server2.httpServer.close();
    //             server && server.httpServer && server.httpServer.close();
    //         })

    //     })
    // });
});