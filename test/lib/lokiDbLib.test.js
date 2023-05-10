'use strict';

process.env.DEBUG = 'koajs-toolkit:*';

const lokiDbLib = require('../../lib/lokiDbLib.js');
const loki = require('lokijs');

describe('lib/lokiDbLib.js', () => {
    test('lokiDbLib Test', async () => {
        expect(1===1).toBe(true);
    });


    test('lokiDbLib initialisation with empty conf', async () => {
        let conf={
        };
        const db=await new lokiDbLib(conf);
        expect(db instanceof loki).toBe(true);
    });

    test('lokiDbLib initialisation with autoload', async () => {
        let conf={
            options:{
                autoload: true
            }
        };
        const db=await new lokiDbLib(conf);
        expect(db instanceof loki).toBe(true);
    });


    test('lokiDbLib initialisation with autoload 2', async () => {
        let conf={
            options:{
                autoload: 'true'
            }
        };
        const db=await new lokiDbLib(conf);
        expect(db instanceof loki).toBe(true);
    });
});