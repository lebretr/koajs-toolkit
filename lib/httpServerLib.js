'use strict';

const fs = require('fs')
    , path = require('path')
    , http = require('http')
    , debug = require('debug')('koajs-toolkit:httpServerLib')
    ;

let httpServer, httpsServer;

const loggerMock=function(m){
        if(typeof m === 'string'){
            debug('%s', m);
        }else if(!Number.isNaN(m)){
            debug('%d', m);
        }else{
            debug('%O', m);
        }
    }
    ;

exports.serve = function(app, config, logger){

    logger=logger||{};
    logger.error=logger.error || loggerMock;
    logger.info=logger.info || loggerMock;

    function loadFile(confHttpx){
        if(confHttpx && confHttpx.options){
            if(Array.isArray(confHttpx.options.ca)){
                for(let i=0, end=confHttpx.options.ca.length; i<end; i++){
                    confHttpx.options.ca[i]=fs.readFileSync(path.resolve(process.cwd(), confHttpx.options.ca[i]), 'utf8');
                }
            }else{
                confHttpx.options.ca=fs.readFileSync(path.resolve(process.cwd(), confHttpx.options.ca), 'utf8');
            }
            if(Array.isArray(confHttpx.options.cert)){
                for(let i=0, end=confHttpx.options.cert.length; i<end; i++){
                    confHttpx.options.cert[i]=fs.readFileSync(path.resolve(process.cwd(), confHttpx.options.cert[i]), 'utf8');
                }
            }else{
                confHttpx.options.cert=fs.readFileSync(path.resolve(process.cwd(), confHttpx.options.cert), 'utf8');
            }
            if(Array.isArray(confHttpx.options.key)){
                for(let i=0, end=confHttpx.options.key.length; i<end; i++){
                    confHttpx.options.key[i]=fs.readFileSync(path.resolve(process.cwd(), confHttpx.options.key[i]), 'utf8');
                }
            }else{
                confHttpx.options.key=fs.readFileSync(path.resolve(process.cwd(), confHttpx.options.key), 'utf8');
            }
        }
    }

    const confHttps=config.https;
    loadFile(confHttps);
    config.https=confHttps;



    let serverCallback = app.callback();

    try {
        if(config.https){
            httpServer = http.createServer(serverCallback);

            httpServer=httpServer
                .listen(config.http.port, function(err) {
                    if (err) {
                        logger.error('HTTP server FAIL: ', err, (err && err.stack));
                    }
                    else {
                        logger.info(`HTTP  server OK: http://${config.domain}:${config.http.port}`);
                    }
                });
        }
    }
    catch (ex) {
        logger.error('Failed to start HTTP server\n', ex, (ex && ex.stack));
    }
    try {
        if(config.https){
            if(config.https.version==='2'){
                httpsServer = require('http2').createSecureServer(config.https.options, serverCallback);
            }else{
                httpsServer = require('https').createServer(config.https.options, serverCallback);
            }

            httpsServer=httpsServer
                .listen(config.https.port, function(err) {
                    if (err) {
                        logger.error('HTTPS server FAIL: ', err, (err && err.stack));
                    }
                    else {
                        logger.info(`HTTPS server OK: https://${config.domain}:${config.https.port}`);
                    }
                });
        }
    }
    catch (ex) {
        logger.error('Failed to start HTTPS server\n', ex, (ex && ex.stack));
    }

    // process.on('SIGTERM', () => {
    //     clearInterval(intervalCDM);
    // });

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
            await closeServer(httpServer);
            await closeServer(httpsServer);
            logger.info('SIGTERM succes stop');
            process.exit(0);
        } catch(e){
            process.exit(1);
        }
    });
};