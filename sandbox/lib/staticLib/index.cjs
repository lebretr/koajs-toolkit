const Koa = require('koa')
    , app = new Koa()
    , { httpServerLib, staticLib } = require('../../../index')
    , logger={
        error: function(...args){
            console.error(...args);
        },
        info: function(...args){
            console.log(...args);
        }
    }
    ;

let conf={
    '/' : './Exemples/staticLib/public'
};

(async function(){
    await new staticLib(app, conf);
    
    app.use(async (ctx,next)=>{
        logger.info('app.use');
        ctx.status=404;
        await next();
    });


    let app_conf={
        'domain': 'localhost',
        'http': {
            'port': 8080
        },
        'https': {
            'version': '1.1',
            'port': 8443,
            'options': {
                'key': './certs/key.pem',
                'cert': './certs/cert.pem',
                'ca': './certs/ca/minica.pem',
                'allowHTTP1':true
            }
        }
    };

    new httpServerLib(app, app_conf, logger);
})();