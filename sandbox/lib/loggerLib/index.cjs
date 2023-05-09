

// import * as manualTest from  '../../../lib/manualTest.js';
// import myLib from  './lib.js'; 


const loggerLib = require('../../../lib/loggerLib.js');
const myLib = require ('./lib.cjs'); 


loggerLib.LoggerAsync({
    "level": "silly",
    "console": {
        "silent": false,
        "colorize": true
    }
}).then((loggerAsync)=>{
    loggerAsync.log('error', 'I am an error');
});


(async()=>{
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

    console.log('========================');
    (new myLib()).run();

    console.log('========================');
    console.log('=       Log FULL       =');
    console.log('========================');
    logMessages(logger);

    console.log('========================');
    console.log('=     CTX BB8 FULL     =');
    console.log('========================');
    logMessages(logger2);

    console.log('========================');
    console.log('=      Log >= WARN     =');
    console.log('========================');
    logMessages(logger3);

    console.log('========================');
    console.log('=   CTX R2D2 >= WARN   =');
    console.log('========================');
    logMessages(logger4);
})();