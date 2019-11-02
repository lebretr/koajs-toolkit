'use strict';

const fs = require('fs')
    , path = require('path')
    , debug = require('debug')('koajs-toolkit:staticLib')
    ;

module.exports = function(app, config){
    const Koa = require('koa')
        , mount = require('koa-mount')
        ;

    return new Promise((resolve)=>{
        let pathSites=config || {} ;

        if(typeof pathSites === 'string'){
            pathSites={'/':pathSites};
        }

        // for(let i=0, end=pathSites.length; i<end; i++){
        let asyncs=[];
        for (let pathSite in pathSites) {
            let pathDir=pathSites[pathSite];

            if(pathDir.indexOf('/')!=0){
                pathDir=path.join(process.cwd() ,pathDir);
            }
            asyncs.push(new Promise(function(resolve){
                fs.stat(pathDir, (err, stat)=>{
                    err && debug(pathDir + ' not exists');
                    if(stat){
                        // si "/_site" exist alors on sert les fichiers present dans ce dossier
                        const appSite=new Koa();
                        appSite.use(require('koa-static')(pathDir, {extensions: ['html','htm','txt']}));
                        app.use(mount(pathSite, appSite));

                        // respond specific 404 page if no file found
                        // const notFoundPage=fs.readFileSync(pathDir+'/assets/html/404.html');
                        // app.use(async (ctx, next) => {
                        //     await next();
                        //     ctx.response.type = 'text/html';
                        //     ctx.response.body = notFoundPage;
                        // });
                    }
                    resolve();
                });
            }));
        }
        Promise.all(asyncs).then(function() {
            resolve();
        });
    });
};