/*eslint no-console: 0*/

'use strict';

var Bluebird = require('bluebird')
    , winston = require('winston');

exports.loggerConfig = function (conf, next) {
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

    logger.msg=winston.log;
    logger.log=function(a,b,c,d,e /*,f,g*/){
        a=a || null, b=b || null, c=c || null, d=d || null, e=e || null/*, f=f || null, g=g || null*/;

        if(a==='silly' || a==='debug' || a==='verbose' || a==='info' || a==='warn' || a==='error'){
            logger.msg(a,b,c,d,e /*,f,g*/);
        }else{
            logger.error(a);//,b,c,d,e /*,f,g*/);
        }
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
        this.verbose=function(a){
            logger.verbose(prefix + a);
        };
        this.log=function(a){
            logger.verbose(prefix + a);
        };
        this.info=function(a){
            logger.info(prefix + a);
        };
        this.warn=function(a){
            logger.warn(prefix + a);
        };
        this.error=function(a){
            logger.error(prefix + a);
        };
        this.silly=function(a){
            logger.silly(prefix + a);
        };
        this.debug=function(a){
            logger.debug(prefix + a);
        };
    };

    exports.logger=logger;

    next();
};

exports.loggerConfigAsync = Bluebird.promisify(exports.loggerConfig);

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
