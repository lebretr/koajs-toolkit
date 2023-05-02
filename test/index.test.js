'use strict';

const{lokiDbLib, loggerLib} = require('../index');
const loki = require('lokijs');
const winston = require('winston');

describe('index.js', () => {
    // test('apiKeyCheckMid exist', async () => {
    //     expect(typeof index.apiKeyCheckMid === 'function' ).toBe(true);
    // });

    // test('httpServerLib exist', async () => {
    //     expect(typeof index.httpServerLib === 'object' ).toBe(true);
    // });

    test('loggerLib is an instanceof winston', async () => {
        const a =  winston.createLogger({
        });
        const logger=await new loggerLib.Logger();
        expect(logger.constructor.name === a.constructor.name).toBe(true);
    });

    test('lokiDbLib is an instanceof lokijs', async () => {
        const db=await new lokiDbLib({});
        expect(db instanceof loki).toBe(true);
    });

    // test('proxyMid exist', async () => {
    //     expect(typeof index.proxyMid === 'function' ).toBe(true);
    // });

    // test('staticLib exist', async () => {
    //     expect(typeof index.staticLib === 'function' ).toBe(true);
    // });
});