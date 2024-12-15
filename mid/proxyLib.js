'use strict';
/*
┏━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┓
┃                              Basic Proxy Service                              ┃
┗━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┛
*/

const clients={
    https: require('https'),
    http: require('http')
};

const //_ = require('lodash')
    // , 
    url = require('url')
    ;

module.exports = function (/*router,*/ config) {
    const CookieLib = require('cookie');

    return async function proxy (ctx) {
        // ctx.logger.silly('enter in proxy lib');

        const proxyConfig=(ctx._config && ctx._config.get && ctx._config.get('proxyConfig')) || config;
        const protocol=proxyConfig.protocol || 'https';

        const options = {
            hostname: proxyConfig.hostname,
            port: proxyConfig.port || 443,
            path: ctx.proxyLibUrl || ctx.url,
            method: ctx.method,
            // headers: JSON.parse(JSON.stringify(ctx.headers)), 
            headers: { ... ctx.headers }, 
            rejectUnauthorized: proxyConfig.rejectUnauthorized === false || true
        };

        delete options.headers['cookie'];
        // delete options.headers['x-request-id'];
        options.headers['x-forwarded-proto']=options.headers['x-forwarded-proto']||ctx.protocol;

        options.headers['X-forwarded-host']=options.headers['host'] || options.headers[':authority'];

        options.headers['x-forwarded-for']=(options.headers['x-forwarded-for'] ? ' ' +options.headers['x-forwarded-for'] : '');
        options.headers['x-forwarded-for']= ctx.ip + options.headers['x-forwarded-for'];

        // delete options.headers['host'];
        options.headers['host']=proxyConfig.hostname;
        if(proxyConfig.port && proxyConfig.port!=80 && proxyConfig.port!=443){
            options.headers['host']=options.headers['host']+':'+proxyConfig.port;
        }

        for(let i in options.headers){
            if(i.match(/^:/)){
                delete options.headers[i];
            }
        }

        for(let i in proxyConfig.headers){
            options.headers[i]=proxyConfig.headers[i];
        }

        const client = clients[protocol];

        return new Promise((resolve,reject)=>{
            const request =  client.request(options, (response) => {
                try{
                    // res.setHeaders(response.headers);
                    for(let i in response.headers){
                        if(i==='location'){
                            const myURL = new url.URL(response.headers[i]);
                            myURL.host=ctx.headers['host'];
                            ctx.set('location',myURL.href);
                        }else if(i!=='access-control-allow-headers' && i!=='set-cookie'){
                            ctx.set(i, response.headers[i]);
                        }
                    }
                    if(response.headers && response.headers['set-cookie'] ){

                        // let toto=response.headers['set-cookie'].join('; ');
                        for(let i in response.headers['set-cookie']){

                            var cookies = CookieLib.parse(response.headers['set-cookie'][i]);

                            const att=response.headers['set-cookie'][i].split('=');

                            if(!att[0].match(/^_proxy_oauth_access/) && !att[0].match(/^_proxy_oauth_access.sig/) && !att[0].match(/^_proxy_redirection/) && !att[0].match(/^_proxy_redirection.sig/)){
                                ctx.cookies.set(att[0], cookies[att[0]], {
                                    maxAge: cookies.maxAge,
                                    expires: new Date(cookies.expires),
                                    path: cookies.path,
                                    // domain: undefined,//cookies.domain,
                                    secure: cookies.secure,
                                    httpOnly: cookies.httpOnly,
                                    signed: false
                                });
                            }
                        }
                    }
                }catch(err){
                    return reject(err);
                }
                ctx.status = response.statusCode;

                response.on('data', function(d) {
                    ctx.res.write(d);
                });
                response.on('end', function() {
                    try{
                        // ctx.res.end();
                        resolve();
                    }catch(err){
                        reject(err);
                    }
                });
            });

            let cookie = ctx.headers.cookie;

            if(typeof cookie === 'string'){
                // supprime les cookie listés dans ce tableau
                ['_proxy_oauth_access','_proxy_oauth_access.sig','_proxy_redirection','_proxy_redirection.sig'].forEach((property)=>{
                    cookie=cookie.replace(new RegExp('(;\\s*' + property + '=)([^;]+)', 'i'), function(/* match, prefix, previousValue */) {
                        return '';
                    });
                    cookie=cookie.replace(new RegExp('(\\s*' + property + '=)(.*?; *)', 'i'), function(/* match, prefix, previousValue */) {
                        return '';
                    });
                });

                request.setHeader('Cookie', cookie);
            }

            ctx.req.on('data', function (data) {
                request.write(data);
            });

            ctx.req.on('end', function () {
                request.end();
            });

            request.on('error', (e) => {
                reject(e);
            });
        });
    };
};
