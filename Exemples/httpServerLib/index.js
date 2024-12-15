
const Koa = require('koa')
    , app = new Koa()
    // , { httpServerLib } = require('@lebretr/koajs-toolkit')
    , { httpServerLib } = require('../../index')
    , logger={
        error: function(m){
            console.error(m);
        },
        info: function(m){
            console.log(m);
        }
    }
    ;

let conf={
    'domain': 'localhost',
    'http': {
        'port': 8080
    },
    'https': {
        'version': '1.1',
        'port': 8443,
        'options': {
            'key': './Exemples/httpServerLib/certs/key.pem',
            'cert': './Exemples/httpServerLib/certs/cert.pem',
            'ca': './Exemples/httpServerLib/certs/ca/minica.pem',
            'allowHTTP1':true
        }
    }
};

httpServerLib.serve(app, conf, logger);