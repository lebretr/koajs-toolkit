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

        logger.log('error', 'I am an error');
        logger.error(new Error('I am a true error'));
        logger.warn('/!\/!\/!\/!\/!\/!\/!\\');
        logger.hack('I hacked you !!!');
        logger.info('here is just an info');
        logger.verbose('here is just an verbose message and I can talk a lot again');
        logger.debug(new Error('I am a true error. Debug me!'));
        logger.silly('lk,bm;bd;!bs!::!;@@^{#^\^@');
        logger.silly({
            a:"a",
            b:"b"
        });
        
    });
});