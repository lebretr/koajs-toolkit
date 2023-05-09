'use strict';

const loggerLib = require('../../lib/loggerLib.js');
const winston = require('winston');


const a =  winston.createLogger({
});

describe('lib/loggerLib.js', () => {
    test('loggerLib Test', async () => {
        expect(1===1).toBe(true);
    });

    test('loggerLib initialisation with empty conf', async () => {
        const logger=await new loggerLib.Logger();
        expect(logger.constructor.name === a.constructor.name).toBe(true);
    });

    test('loggerLib initialisation with empty conf', async () => {
        let conf={
        };
        const logger=await new loggerLib.Logger(conf);
        expect(logger.constructor.name === a.constructor.name).toBe(true);
    });

    // test('loggerLib initialisation with gg_stackdriver', async () => {
    //     let conf={
    //         "level": "info",
    //         "gg_stackdriver": true, // True if you publish your app on GCP
    //     };
    //     const logger=await new loggerLib.Logger(conf);
    //     logger.log('error', new Error('I am an error'));
    //     expect(typeof logger .log === "function").toBe(true);
    // });

    test('loggerLib initialisation with console and file', async () => {
        let conf={
            "level": "info",
            "gg_stackdriver": false, // True if you publish your app on GCP
            "console": {
                "silent": false,
                "colorize": true
            },
            "file":{
                "filename": "combined.log"
            }
        };
        const logger=await new loggerLib.Logger(conf);
        logger.log('error', new Error('I am an error'));
        
        expect(logger.constructor.name === a.constructor.name).toBe(true);
    });

    test('loggerLib initialisation with file and maxsize', async () => {
        let conf={
            "level": "info",
            "file":{
                "filename": "combined.log",
                "maxsize": 1
            }
        };
        const logger=await new loggerLib.Logger(conf);
        logger.log('error', new Error('I am an error'));
        
        expect(logger.constructor.name === a.constructor.name).toBe(true);
    });

    test('loggerLib initialisation with console without colorize and replace node console', async () => {
        let conf={
            "level": "silly",
            "console": {
                "silent": false,
                "colorize": true
            },
        };
        const logger=await new loggerLib.Logger(conf);
        
        expect(logger.constructor.name === a.constructor.name).toBe(true);

        
        logMessages(logger);
        
    });

    test('loggerLib initialisation with getLogger', async () => {
        let conf={
            "level": "info",
            "gg_stackdriver": false, // True if you publish your app on GCP
            "console": {
                "silent": false,
                "colorize": true
            }
        };
        const logger=await new loggerLib.Logger(conf,'one');
        const loggerOne=loggerLib.getLogger('one')
        loggerOne.log('error', new Error('I am an error logged via getLogger'));
        
        expect(logger.constructor.name === a.constructor.name).toBe(true);
    });

    test('loggerLib initialisation with LoggerForContext', async () => {
        const { readFile,rmSync } = require( 'node:fs' );

        try{
            rmSync('./combined_test.log');
        }catch(e){
            null;
        }

        let conf={
            "level": "silly",
            "gg_stackdriver": false, // True if you publish your app on GCP
            "console": {
                "silent": false,
                "colorize": true
            },
            "file":{
                "filename": "combined_test.log"
            }
        };
        const logger=await new loggerLib.Logger(conf);

        logMessages(logger);

        const loggerCtx = new loggerLib.LoggerForContext(logger, 'R2D2');

        logMessages(loggerCtx);

        // await new Promise((r) => setTimeout(r, 2000));

        // readFile('./combined_test.log', (err, data) => {
        //     if (err) throw err;
        //     if(data.includes('error: {"a":"a","b":"b"}')){
        //         expect(true).toBe(true);
        //     }else{
        //         expect(false).toBe(true);
        //     }
        // }); 

    }, 5000);
});

const logMessages=function(logger){
    console.log('------------------------');
    console.log('-    EMPTY MESSAGE     -');
    console.log('------------------------');
    logger.log();
    logger.log('error');
    logger.log('warn');
    logger.log('hack');
    logger.log('info');
    logger.log('http');
    logger.log('verbose');
    logger.log('debug');
    logger.log('silly');

    console.log('------------------------');
    console.log('-       USE LOG        -');
    console.log('------------------------');
    logger.log('error', 'I am an error');
    logger.log('warn', '/!\/!\/!\/!\/!\/!\/!\\');
    logger.log('hack', 'I hacked you !!!');
    logger.log('info', 'here is just an info');
    logger.log('http', 'here is http://test/');
    logger.log('verbose', 'here is just an verbose message and I can talk a lot again');
    logger.log('debug', 'I am an error. Debug me!');
    logger.log('silly', 'lk,bm;bd;!bs!::!;@@^{#^\^@');


    console.log('------------------------');
    console.log('-      ERROR OBJ       -');
    console.log('------------------------');
    logger.error(new Error('I am a true error'));
    logger.debug(new Error('I am a true error. Debug me!'));
    

    console.log('------------------------');
    console.log('-      DEDICATED       -');
    console.log('------------------------');
    logger.error('I am an error');
    logger.warn('/!\/!\/!\/!\/!\/!\/!\\');
    logger.hack('I hacked you !!!');
    logger.info('here is just an info');
    logger.http('here is http://test/');
    logger.verbose('here is just an verbose message and I can talk a lot again');
    logger.debug('I am an error. Debug me!');
    logger.silly('lk,bm;bd;!bs!::!;@@^{#^\^@');

    console.log('------------------------');
    console.log('-       LOG  OBJ       -');
    console.log('------------------------');
    logger.log('error', {a:"a",b:"b"});
    logger.log('warn', {a:"a",b:"b"});
    logger.log('hack', {a:"a",b:"b"});
    logger.log('info', {a:"a",b:"b"});
    logger.log('http', {a:"a",b:"b"});
    logger.log('verbose', {a:"a",b:"b"});
    logger.log('debug', {a:"a",b:"b"});
    logger.log('silly', {a:"a",b:"b"});

    console.log('------------------------');
    console.log('-    DEDICATED  OBJ    -');
    console.log('------------------------');
    logger.error({a:"a",b:"b"});
    logger.warn({a:"a",b:"b"});
    logger.hack({a:"a",b:"b"});
    logger.info({a:"a",b:"b"});
    logger.http({a:"a",b:"b"});
    logger.verbose({a:"a",b:"b"});
    logger.debug({a:"a",b:"b"});
    logger.silly({a:"a",b:"b"});
    
}