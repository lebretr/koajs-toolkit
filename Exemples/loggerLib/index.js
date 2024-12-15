//const {loggerLib} = require('@lebretr/koajs-toolkit')
const {loggerLib} = require('../../index')
    ;

let conf={
    "level": "silly",
    "gg_stackdriver": false, // True if you publish your app on GCP
    "console": {
        "silent": false,
        "colorize": true
    },
    "file":{
        "filename": "combined.log"
    }
};

(async function (){
    await loggerLib.loggerConfigAsync(conf);
    const logger=loggerLib.logger;
    logger.error(new Error('I am an error'));
    logger.debug(new Error('Debug me!'));
    logger.warn('/!\\/!\\/!\\ Yeah /!\\/!\\/!\\');

    logger.silly('┣━━━━━━━━━━━━━━━━━━━━━━━┫');

    logger.silly('text');
    logger.debug(10);
    logger.verbose(true);
    logger.warn(null);
    logger.error(undefined);
    logger.error([null]);
    logger.error({a:'b'});
    
    logger.silly('┣━━━━━━━━━━━━━━━━━━━━━━━━━┫');
    logger.hack( '┣ hack is only in console ┫')
    logger.silly('┣━━━━━━━━━━━━━━━━━━━━━━━━━┫');
    l1=new logger.log_ctx('12345')
    l2=new logger.log_ctx('98765')
    
    l1.warn('text 1');
    l1.warn(11);
    l2.warn('text 2');
    l2.warn(12);

    l1.silly('text');
    l2.debug(10);
    l1.verbose(true);
    l2.warn(null);
    l1.error(undefined);
    l2.error([null]);
    l1.error({a:'b'});
    l2.error(new Error('this is an Error'));

    logger.silly('┣━━━━━━━━━━━━━━━━━━━━━━━┫');
    logger.log({level:'error', message:'bou'});
    logger.log({level:'debug', message:new Error('an error')});
    logger.log({level:'debug', message:{a:'bou',b:'bou'}});
    logger.log({level:'debug', message:['bou','bou']});
    
})();