'use strict'

// import * as loggerLib from  '../../../lib/loggerLib.js';

const loggerLib = require('../../../lib/loggerLib.js');

module.exports =  class MyLib{
    constructor(){

    }

    run = function(){
        const logger33=loggerLib.getLogger('logger3');
        
        logger33.log('error', 'I am an error from lib ');
        logger33.error(new Error('I am a true error from lib '));
        logger33.warn('/!\/!\/!\/!\/!\/!\/!\\ from lib ');
        logger33.hack('I hacked you !!! from lib ');
        logger33.info('here is just an info');
        logger33.verbose('here is just an verbose message and I can talk a lot again from lib ');
        logger33.debug(new Error('I am a true error. Debug me! from lib '));
        logger33.silly('lk,bm;bd;!bs!::!;@@^{#^\^@ from lib ');
        logger33.silly({
            a:"a",
            b:"b"
        });
    }
}