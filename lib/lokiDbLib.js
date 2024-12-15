'use strict';

exports.databaseInitialize=function(config){

    const loki = require('lokijs');

    return new Promise(resolve => {
        if (config.options && (config.options.autoload===true || config.options.autoload==='true')){
            config.options.autoloadCallback = function(){
                return resolve();
            };
        }else{
            resolve();
        }
        exports.db = new loki(config.name || 'data/offers.db',config.options);
    });
};