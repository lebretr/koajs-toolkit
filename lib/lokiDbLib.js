'use strict';

//https://github.com/techfort/LokiJS/wiki

const debug=require('debug')('koajs-toolkit:loggerLib');

exports.databaseInitialize = function (config){

    const loki = require('lokijs');

    return new Promise(resolve => {
        let db;
        if (config.options && (config.options.autoload===true || config.options.autoload==='true')){
            config.options.autoloadCallback = function(){
                return resolve(db);
            };
            db=new loki(config.name || 'data/offers.db',config.options);
        }else{
            db=new loki(config.name || 'data/offers.db',config.options);
            resolve(db);
        }
        
    });
}


module.exports =  class DatabaseLib{
    constructor(config) {
        debug('%s', 'construct');
        
        const loki = require('lokijs');

        return new Promise(resolve => {
            let db;
            if (config.options && (config.options.autoload===true || config.options.autoload==='true')){
                config.options.autoloadCallback = function(){
                    return resolve(db);
                };
                db=new loki(config.name || 'data/offers.db',config.options);
            }else{
                db=new loki(config.name || 'data/offers.db',config.options);
                resolve(db);
            }
            
        });
    }
}