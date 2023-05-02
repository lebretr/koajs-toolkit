'use strict';

const debug=require('debug')('koajs-toolkit:loggerLib');

let allLoggers={}

exports.getLogger = function getLogger(name){
    name = name || 'default';
    return allLoggers[name];
}

exports.Logger = class Logger {
    constructor(conf,name) {
        name = name || 'default';
        conf=conf || {}

        debug('%s', 'try to import winston');
        const winston = require('winston');
        debug('%s', 'import winston sucessful');

        const myFormat = winston.format.printf(({ level, message, timestamp }) => { //label,
            if (typeof message === 'object'){
                return `${timestamp} ${level}: ${JSON.stringify(message)}`;//[${label}]
            }else{
                return `${timestamp} ${level}: ${message}`;//[${label}]
            }
        });

        let loggerW;
        if(conf && conf.gg_stackdriver && conf.gg_stackdriver.toString()==='true'){
            // Imports the Google Cloud client library for Winston
            const {LoggingWinston} = require('@google-cloud/logging-winston');
            const loggingWinston = new LoggingWinston();
            loggerW=winston.createLogger({
                level: conf.level || undefined,
                transports: [
                    new winston.transports.Console(),
                    // Add Stackdriver Logging
                    loggingWinston,
                ],
            });
        }else{

            loggerW=winston.createLogger({
                level: conf.level || undefined,
                format: winston.format.combine(
                    winston.format.timestamp(),
                    // w(inston.format.label({ label: 'right meow!' }),
                    myFormat
                )
            });

            if(conf && conf.file && conf.file.maxsize){
                conf.file.maxsize=conf.file.maxsize * 1024 * 1024;
            }

            if(conf && conf.console){
                loggerW.remove(winston.transports.Console);

                if(conf.console.colorize){

                    conf.console.format= winston.format.combine(
                        winston.format.colorize(),
                        winston.format.timestamp(),
                        // winston.format.label({ label: 'right meow!' }),
                        myFormat
                    );
                }

                loggerW.add(new winston.transports.Console(conf.console));
            }
            if(conf && conf.file){
                loggerW.add(new winston.transports.File(conf.file));
            }

            if(conf && conf.replaceNodeJsConsole){
                console.log=this.verbose;
                console.info=this.info;
                console.warn=this.warn;
                console.error=this.error;
            }
        }

        // Object.setPrototypeOf(myLogger.prototype, myLogger);
        this.__proto__=loggerW;
        this.name=name
        this.msg=this.log;
        this.log=this.#log_with_compatibility;

        allLoggers[name]=this;
        return this;
    }
    
    #log_with_compatibility=function(a,b,c,d,e /*,f,g*/){
        a=a || null, b=b || null, c=c || null, d=d || null, e=e || null/*, f=f || null, g=g || null*/;

        if(a==='silly' || a==='debug' || a==='verbose' || a==='info' || a==='warn' || a==='error'){
            this.msg(a,b,c,d,e /*,f,g*/);
        }else{
            this.error(a);//,b,c,d,e /*,f,g*/);
        }
    };

    error=function(a,b,c,d,e /*,f,g*/){
        if(a.stack){
            this.msg('error',a.stack,b,c,d,e);
        }else{
            this.msg('error',a,b,c,d,e);
        }
    };
    
    debug=function(a,b,c,d,e /*,f,g*/){
        if(a.stack){
            this.msg('debug',a.stack,b,c,d,e);
        }else{
            this.msg('debug',a,b,c,d,e);
        }
    };

    hack=function(message){
        this.warn([
            '\x1b[47m', // background white
            '\x1b[31;1m' +'HACK WARNING:' , // bold red
            '\x1b[30;1m'+ message , // bold black
            '\x1b[0m' // reset
        ].join(' '));
    }
}

exports.LoggerForContext = class LoggerForContext {
    constructor(logger,uuid) {
        let prefix='';
        if(typeof uuid ==='string'){
            prefix=uuid+' - ';
        }
        this.log=function(a,b,c,d,e){
            if (typeof a === 'object'){
                logger.log(a, prefix + JSON.stringify(b),c,d,e);
            }else{
                logger.log(prefix + a);
            }
        };
        this.error=function(a){
            if (typeof a === 'object'){
                logger.error(prefix + JSON.stringify(a));
            }else{
                logger.error(prefix + a);
            }
        };
        this.warn=function(a){
            if (typeof a === 'object'){
                logger.warn(prefix + JSON.stringify(a));
            }else{
                logger.warn(prefix + a);
            }
        };
        this.info=function(a){
            if (typeof a === 'object'){
                logger.info(prefix + JSON.stringify(a));
            }else{
                logger.info(prefix + a);
            }
        };
        this.verbose=function(a){
            if (typeof a === 'object'){
                logger.verbose(prefix + JSON.stringify(a));
            }else{
                logger.verbose(prefix + a);
            }
        };
        this.debug=function(a){
            if (typeof a === 'object'){
                logger.debug(prefix + JSON.stringify(a));
            }else{
                logger.debug(prefix + a);
            }
        };
        this.silly=function(a){
            if (typeof a === 'object'){
                logger.silly(prefix + JSON.stringify(a));
            }else{
                logger.silly(prefix + a);
            }
        };
        this.hack=function(a){
            if (typeof a === 'object'){
                logger.hack(prefix + JSON.stringify(a));
            }else{
                logger.hack(prefix + a);
            }
        };
    }
}

// exports.asyncClass = class AsyncClass {
//     constructor(logger,uuid) {
//         debug('%s', 'construct');
//         return new Promise (resolve=>{
//             debug('%s', 'before resolve');
//             setTimeout(()=>{
//                 debug('%s', 'before setTimeout resolve');
//                 resolve(this);
//                 debug('%s', 'after setTimeout resolve');

//             },2000)
//         })
//     }
//     a="oui";
// }