/*eslint no-console: 0*/

'use strict';

exports.loggerConfig = function (conf, next) {
    var winston = require('winston');

    const myFormat = winston.format.printf(({ level, message, timestamp }) => { //label,
        return `${timestamp} ${level}: ${message}`;//[${label}]
    });

    var logger;
    if(conf && conf.gg_stackdriver && conf.gg_stackdriver.toString()==='true'){
        // Imports the Google Cloud client library for Winston
        const {LoggingWinston} = require('@google-cloud/logging-winston');
        const loggingWinston = new LoggingWinston();
        logger=winston.createLogger({
            level: conf.level || undefined,
            transports: [
                new winston.transports.Console(),
                // Add Stackdriver Logging
                loggingWinston,
            ],
        });
    }else{
        logger=winston.createLogger({
            level: conf.level || undefined,
            format: winston.format.combine(
                winston.format.timestamp(),
                // winston.format.label({ label: 'right meow!' }),
                myFormat
            )
        });

        if(conf && conf.file && conf.file.maxsize){
            conf.file.maxsize=conf.file.maxsize * 1024 * 1024;
        }

        if(conf && conf.console){
            logger.remove(winston.transports.Console);

            if(conf.console.colorize){
                conf.console.format= winston.format.combine(
                    winston.format.colorize(),
                    winston.format.timestamp(),
                    // winston.format.label({ label: 'right meow!' }),
                    myFormat
                );
            }
            logger.add(new winston.transports.Console(conf.console));
        }
        if(conf && conf.file){
            logger.add(new winston.transports.File(conf.file));
        }
    }

    if(conf && conf.replaceNodeJsConsole){
        console.log=logger.verbose;
        console.info=logger.info;
        console.warn=logger.warn;
        console.error=logger.error;
    }

    logger.genuine_log=logger.log;

    logger.retrocompatibility=function(a,b,c,d,e){
        if(a && a.level && a.message){
            b=a.message;
            a=a.level;
        }
        //a=a || null, b=b || null, c=c || null, d=d || null, e=e || null/*, f=f || null, g=g || null*/;

        if(a==='silly' || a==='debug' || a==='verbose' || a==='info' || a==='warn' || a==='error'){
            if(b!== undefined && typeof b === 'object'){
                if(b instanceof Error ){
                    b=b.message;
                }else{
                    b=JSON.stringify(b);
                }
            }
            logger.genuine_log(a,b,c,d,e);
        }else{
            logger.error(a);
        }
    };

    logger.log=function(a,b,c,d,e){
        logger.retrocompatibility(a,b,c,d,e);
    };

    
    logger.silly=function(a){
        logger.log('silly',a);
    };
    logger.debug=function(a){
        logger.log('debug',a);
    };
    logger.verbose=function(a){
        logger.log('verbose',a);
    };
    logger.info=function(a){
        logger.log('info',a);
    };
    logger.warn=function(a){
        logger.log('warn',a);
    };
    logger.error=function(a){
        logger.log('error',a);
    };

    logger.hack=function(message){
        console.warn([
            '\x1b[47m', // background white
            '\x1b[31;1m' +'HACK WARNING:' , // bold red
            '\x1b[30;1m'+ message , // bold black
            '\x1b[0m' // reset
        ].join(' '));
    };

    logger.log_ctx=function(uuid){
        let prefix='';
        if(typeof uuid ==='string'){
            prefix=uuid+' - ';
        }
        this.log=function(a,b){
            if( typeof b === 'object'){
                if(b instanceof Error ){
                    b=b.message;
                }else{
                    b=JSON.stringify(b);
                }
                return logger.retrocompatibility(a, prefix + b);
            }else if(a && a.message){
                if(typeof a.message === 'object'){
                    a.message= prefix + JSON.stringify(a.message);
                }else{
                    a.message=prefix + a.message;
                }
                return logger.retrocompatibility(a);
            }
            logger.retrocompatibility(a, prefix + b);
        };
        this.silly=function(a){
            this.log('silly',a);
        };
        this.debug=function(a){
            this.log('debug',a);
        };
        this.verbose=function(a){
            this.log('verbose',a);
        };
        this.info=function(a){
            this.log('info',a);
        };
        this.warn=function(a){
            this.log('warn',a);
        };
        this.error=function(a){
            this.log('error',a);
        };
    };

    exports.logger=logger;

    next();
};

exports.loggerConfigAsync = function (conf) {
    return new Promise((resolve,reject)=>{
        try{
            exports.loggerConfig(conf,resolve);
        }catch(e){
            reject(e);
        }
    });
};

// exports.logError = function () {
//     return function logErrorLib (err, req, res, next) {
//         if(err.stack){
//             winston.error(err.stack);
//         }else{
//             winston.error(err);
//         }

//         next(err);
//     };
// };
