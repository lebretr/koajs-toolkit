'use strict';

process.env.DEBUG = 'koajs-toolkit:*';
process.env.NODE_TLS_REJECT_UNAUTHORIZED = 0; 

const httpServerLib = require('../../lib/httpServerLib.js');
const staticLib = require('../../lib/staticLib.js');
const Koa = require('koa')
    , request = require('supertest')
    ;

describe('lib/staticLib.js', () => {
    test('staticLib Test', async () => {
        expect(1===1).toBe(true);
    });


    test('staticLib initialisation with empty conf', async () => {
        let app = new Koa();
        let conf={
        };
        let confStatic={
            "/" : "./public"
        };
        
        await new staticLib(app, confStatic);

        app.use(async (ctx,next)=>{
            ctx.body={ 'status':ctx.status };
        });
        let server  = new httpServerLib(app, conf);
        //http tests
        server && server.httpServerListenReady.then(()=>{
            server && server.httpServer && server.httpServer.close();
        });
        //https tests
        server && server.httpsServerListenReady.then(()=>{
            server && server.httpsServer && server.httpsServer.close();
        });
    });


    test('staticLib initialisation with conf object', async () => {
        let app = new Koa();
        let conf={
            'domain': 'localhost',
            'http': {
                'port': 8080
            },
            'https': {
                // "version": "1.1",
                'version': '2',
                'port': 8443,
                'options': {
                    'key': 'certs/key.pem',
                    'cert': 'certs/cert.pem',
                    'ca': 'certs/ca/minica.pem',
                    'allowHTTP1':true
                }
            }
        };
        
        let confStatic={
            "/" : "./sandbox/lib/staticLib/public"
        };
        
        await new staticLib(app, confStatic);

        app.use(async (ctx,next)=>{
            ctx.status=404;
        });
        let server  = new httpServerLib(app, conf);
        //http tests
        server && await server.httpServerListenReady.then(async()=>{
            let agent = request.agent(server.httpServer);
            const response = await agent.get('/logo.png');
            expect(response.statusCode).toBe(200);

            const response2 = await agent.get('/logo2.png');
            expect(response2.statusCode).toBe(404);
            server && server.httpServer && server.httpServer.close();
        });
        //https tests
        server && await server.httpsServerListenReady.then(async()=>{
            let agent = request.agent(server.httpsServer);
            const response = await agent.get('/logo.png');
            expect(response.statusCode).toBe(200);

            const response2 = await agent.get('/logo2.png');
            expect(response2.statusCode).toBe(404);
            server && server.httpsServer && server.httpsServer.close();
        });
    });


    test('staticLib initialisation with conf string', async () => {
        let app = new Koa();
        let conf={
            'domain': 'localhost',
            'http': {
                'port': 8080
            },
            'https': {
                // "version": "1.1",
                'version': '2',
                'port': 8443,
                'options': {
                    'key': 'certs/key.pem',
                    'cert': 'certs/cert.pem',
                    'ca': 'certs/ca/minica.pem',
                    'allowHTTP1':true
                }
            }
        };
        
        let confStatic="./sandbox/lib/staticLib/public";
        
        await new staticLib(app, confStatic);

        app.use(async (ctx,next)=>{
            ctx.status=404;
        });
        let server  = new httpServerLib(app, conf);
        //http tests
        server && await server.httpServerListenReady.then(async()=>{
            let agent = request.agent(server.httpServer);
            const response = await agent.get('/logo.png');
            expect(response.statusCode).toBe(200);

            const response2 = await agent.get('/logo2.png');
            expect(response2.statusCode).toBe(404);
            server && server.httpServer && server.httpServer.close();
        });
        //https tests
        server && await server.httpsServerListenReady.then(async()=>{
            let agent = request.agent(server.httpsServer);
            const response = await agent.get('/logo.png');
            expect(response.statusCode).toBe(200);

            const response2 = await agent.get('/logo2.png');
            expect(response2.statusCode).toBe(404);
            server && server.httpsServer && server.httpsServer.close();
        });
    });
});