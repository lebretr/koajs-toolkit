'use strict';

const debug=require('debug')('koajs-toolkit:apiKeyCheckLib');

module.exports = class apiKeyCheckMib {
    constructor(config) {
        config=config || {};
        let apikeys=config.keys;
        if(apikeys && typeof config.header=== 'string'){
            //if apikeys is string then we transform into array
            if(typeof apikeys === 'string'){
                apikeys=[apikeys];
            }
            if(Array.isArray(apikeys) && apikeys.length>0){
                return async (ctx, next) => {
                    //if apikey in header is valid, then we continue
                    if(ctx.headers[config.header]){
                        for(let i=0, end=apikeys.length; i<end; i++){
                            if(ctx.headers[config.header] === apikeys[i]){
                                return await next();
                            }
                        }
                    }

                    let msg='"' + config.header + '" is "' + ctx.headers[config.header] + '". so this is not ok!';
                    if(ctx.logger && ctx.logger.silly){
                        ctx.logger.silly(msg);
                    }else{
                        debug('%s', msg);
                    }

                    const e = new Error('Unauthorized');
                    e.status=401;
                    throw e;
                    // return {status:500, message:"Unauthorized"};
                };
            }
        }
        return async (ctx, next) =>{
            await next();
        }
    }
};