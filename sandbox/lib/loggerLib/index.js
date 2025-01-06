

import * as loggerLib from  '../../../lib/loggerLib.js';
import myLib from  './lib.js'; 


// const loggerLib = require('../../../lib/loggerLib.js');
// const myLib = require ('./lib.cjs'); 

// (async()=>{
    const logger=await new loggerLib.Logger({
        "level": "silly",
        "console": {
            "silent": false,
            "colorize": true
        }
    });
    const logger2 = new loggerLib.LoggerForContext(logger, 'BB8');

    const logger3=await new loggerLib.Logger({
        "level": "warn",
        "console": {
            "silent": false,
            "colorize": true
        }
    },'logger3');
    const logger4 = new loggerLib.LoggerForContext(logger3, 'R2D2');


    function logSomething(logger){
        logger.log('error', 'I am an error');
        logger.error(new Error('I am a true error'));
        logger.warn('/!\/!\/!\/!\/!\/!\/!\\');
        logger.hack('I hacked you !!!');
        logger.info('here is just an info');
        logger.verbose('here is just an verbose message and I can talk a lot again');
        logger.debug(new Error('I am a true error. Debug me!'));
        logger.silly('lk,bm;bd;!bs!::!;@@^{#^\^@');
        logger.log('error', {
            a:"a",
            b:"b"
        });
        logger.silly({
            a:"a",
            b:"b"
        });
    }

    (new myLib()).run();

    logSomething(logger);
    logSomething(logger2);
    logSomething(logger3);
    logSomething(logger4);

// })();