'use strict';

module.exports = function (config) {
    config=config || {};
    let apikeys=config.keys;
    if(apikeys && typeof config.header=== 'string'){
        //if apikeys is string then we transform into array
        if(typeof apikeys === 'string'){
            apikeys=[apikeys];
        }
        if(Array.isArray(apikeys) && apikeys.length>0){
            return async (ctx, next) => {
                //if apikeys in header is valid, then we pass
                if(ctx.headers[config.header]){
                    for(let i=0, end=apikeys.length; i<end; i++){
                        if(ctx.headers[config.header] === apikeys[i]){
                            return await next();
                        }
                    }
                }
                ctx.logger && ctx.logger.silly && ctx.logger.silly(config.header + ' ' + ctx.headers[config.header] + ' not ok');
                const e = new Error('Unauthorized');
                e.status=401;
                throw e;
            };
        }
    }
    return async (ctx, next) =>{
        await next();
    }
};
