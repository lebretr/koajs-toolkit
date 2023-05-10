'use strict';

const debug = require('debug')('koajs-toolkit:httpServerLib')
    ;

module.exports = class HttpServerLib {
    constructor(app, config, logger){

        const fs = require('fs')
            , path = require('path')
            , http = require('http')
            ;

        const loggerMock=function(m){
            debug('%s', m);
        };

        logger=logger||{};
        logger.error=logger.error || loggerMock;
        logger.info=logger.info || loggerMock;
        logger.debug=logger.debug || loggerMock;

        function loadFile(confHttpx){
            if(confHttpx && confHttpx.options){
                if(confHttpx.options.ca){
                    if(Array.isArray(confHttpx.options.ca)){
                        for(let i=0, end=confHttpx.options.ca.length; i<end; i++){
                            confHttpx.options.ca[i]=fs.readFileSync(path.resolve(process.cwd(), confHttpx.options.ca[i]), 'utf8');
                        }
                    }else{
                        confHttpx.options.ca=fs.readFileSync(path.resolve(process.cwd(), confHttpx.options.ca), 'utf8');
                    }
                }
                if(confHttpx.options.cert){
                    if(Array.isArray(confHttpx.options.cert)){
                        for(let i=0, end=confHttpx.options.cert.length; i<end; i++){
                            confHttpx.options.cert[i]=fs.readFileSync(path.resolve(process.cwd(), confHttpx.options.cert[i]), 'utf8');
                        }
                    }else{
                        confHttpx.options.cert=fs.readFileSync(path.resolve(process.cwd(), confHttpx.options.cert), 'utf8');
                    }
                }
                if(confHttpx.options.key){
                    if(Array.isArray(confHttpx.options.key)){
                        for(let i=0, end=confHttpx.options.key.length; i<end; i++){
                            confHttpx.options.key[i]=fs.readFileSync(path.resolve(process.cwd(), confHttpx.options.key[i]), 'utf8');
                        }
                    }else{
                        confHttpx.options.key=fs.readFileSync(path.resolve(process.cwd(), confHttpx.options.key), 'utf8');
                    }
                }
                if(confHttpx.options.pfx){
                    if(Array.isArray(confHttpx.options.pfx)){
                        for(let i=0, end=confHttpx.options.pfx.length; i<end; i++){
                            confHttpx.options.pfx[i]=fs.readFileSync(path.resolve(process.cwd(), confHttpx.options.pfx[i]), 'utf8');
                        }
                    }else{
                        confHttpx.options.pfx=fs.readFileSync(path.resolve(process.cwd(), confHttpx.options.pfx), 'utf8');
                    }
                }
            }
        }

        const confHttps=config.https;
        loadFile(confHttps);
        config.https=confHttps;

        let serverCallback = app.callback();

        this.httpServerListenReady = new Promise((resolve,reject)=>{
            if(config.http){
                try {
                    this.httpServer = http.createServer(serverCallback);
                    this.httpServer.on('error', (err, socket) => {
                        logger.error('HTTP server FAIL: ' + err.message);
                        logger.debug('HTTP server FAIL: ' + (err.stack || ''));
                        reject(err);
                    });

                    this.httpServer=this.httpServer
                        .listen(config.http.port, function(err) {
                            if (err) {
                                logger.error('HTTP server FAIL: ' + err.message);
                                logger.debug('HTTP server FAIL: ' + (err.stack || ''));
                                reject(err);
                            }
                            else {
                                logger.info(`HTTP  server OK: http://${config.domain}:${config.http.port}`);
                                resolve();
                            }
                        });
                }catch (err) {
                    logger.error('Failed to start HTTP server: ' + err.message);
                    logger.debug('Failed to start HTTP server: ' + (err.stack || ''));
                    reject(err);
                }
            }else{
                resolve();
            }
        });
        this.httpsServerListenReady = new Promise((resolve,reject)=>{
            if(config.https){
                try {
                    if(config.https.version==='2'){
                        this.httpsServer = require('http2').createSecureServer(config.https.options, serverCallback);
                    }else{
                        this.httpsServer = require('https').createServer(config.https.options, serverCallback);
                    }

                    this.httpsServer.on('error', (err, socket) => {
                        logger.error('HTTPS server FAIL: ' + err.message);
                        logger.debug('HTTPS server FAIL: ' + (err.stack || ''));
                        reject(err);
                    });

                    this.httpsServer=this.httpsServer
                        .listen(config.https.port, function(err) {
                            if (err) {
                                logger.error('HTTPS server FAIL: ' + err.message);
                                logger.debug('HTTPS server FAIL: ' + (err.stack || ''));
                                reject(err);
                            }
                            else {
                                logger.info(`HTTPS server OK: https://${config.domain}:${config.https.port}`);
                                resolve();
                            }
                        });
                    }catch (err) {
                        logger.error('Failed to start HTTPS server: ' + err.message);
                        logger.debug('Failed to start HTTPS server: ' + (err.stack || ''));
                        reject(err);
                    }
            }else{
                resolve();
            }
        });

        process.on('SIGTERM', async () => {

            function closeServer(server){
                return (new Promise((resolve,reject)=>{
                    if(server && server.close){
                        server.close((err) => {
                            if (err) {
                                reject(err);
                            }
                            resolve();
                        });
                    }else{
                        resolve();
                    }
                }));
            }

            try{
                this.httpServer && await closeServer(this.httpServer);
                this.httpsServer && await closeServer(this.httpsServer);
                logger.info('SIGTERM succes stop');
                process.exit(0);
            } catch(e){
                process.exit(1);
            }
        });
    }
}