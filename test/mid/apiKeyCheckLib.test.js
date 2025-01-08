'use strict';

process.env.DEBUG = 'koajs-toolkit:*';
process.env.NODE_TLS_REJECT_UNAUTHORIZED = 0; 

const httpServerLib = require('../../lib/httpServerLib.js');
const apiKeyCheckMid = require('../../mid/apiKeyCheckLib.js');
const Koa = require('koa')
    , request = require('supertest')
    ;

let httpPort=8080
  , httpsPort=8443;

describe('mid/apiKeyCheckLib.js', () => {
    test('apiKeyCheckMid Test', async () => {
        expect(1===1).toBe(true);
    });

    test('apiKeyCheckMid initialisation with empty conf', async () => {
        let app = new Koa();
        let conf={
            "domain": "localhost",
            "http": {
                "port": httpPort++
            }
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
        
        app.use(new apiKeyCheckMid());

        app.use(async (ctx,next)=>{
            ctx.body={ 'status': 200 };
        });

        let server  = new httpServerLib(app, conf);
        //http tests
        server && await server.httpServerListenReady.then(async ()=>{
            let agent = request.agent(server.httpServer);
            const response = await agent.get('/');
            expect(response.statusCode).toBe(200);
            server && server.httpServer && server.httpServer.close();
        });
    });

    test('apiKeyCheckMid initialisation with conf', async () => {
        let app = new Koa();
        let conf={
            "domain": "localhost",
            "http": {
                "port": httpPort++
            }
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
        
        app.use(new apiKeyCheckMid({
            header:'x-apikey',
            keys:"AJG94H-FJ9-IEBWNVU7493BEJ1-8433"
        }));
        
        app.use(async (ctx,next)=>{
            ctx.body={ 'status': 200 };
        });

        let server  = new httpServerLib(app, conf);
        //http tests
        server && await server.httpServerListenReady.then(async ()=>{

            let agent = request.agent(server.httpServer);
            const responseUnauthorized = await agent.get('/');
            console.log(responseUnauthorized)
            expect(responseUnauthorized.statusCode).toBe(401);

            agent.set({'x-apikey':'AJG94H-FJ9-IEBWNVU7493BEJ1-8433'})
            const responseAauthorized = await agent.get('/');
            expect(responseAauthorized.statusCode).toBe(200);

            agent.set({'x-apikey':'ZZZZ-AAAA-90'})
            const responseUnauthorized2 = await agent.get('/');
            expect(responseUnauthorized2.statusCode).toBe(401);

            server && server.httpServer && server.httpServer.close();
        });
    });
});