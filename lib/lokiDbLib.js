'use strict';

const Promise=require('bluebird');

const loki = require('lokijs');

exports.databaseInitialize=function(config){
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