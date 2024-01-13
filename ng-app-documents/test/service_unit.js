'use strict';
const sinonChai = require("sinon-chai");
const chai = require('chai');
chai.should();
const chaiAsPromised = require('chai-as-promised');
chai.use(chaiAsPromised);
chai.use(sinonChai);
const proxyquire = require('proxyquire');
const path = require('path');
global.appBase = path.resolve(__dirname, '../');
const expect = chai.expect;

describe('routes', () => {
  // const service = require('../server/services/service');
  const {activate} = proxyquire(path.join(global.appBase, 'server/services/service'), {
    log4js: {
      getLogger() {
        return {
          debug() {
          },
          info() {
          },
          trace() {
          },
          error() {
          }
        };
      }
    },
    lodash: {
      get: (msg) => null,
    },
    "request-promise": (url) => {
      if (url === 'http://127.0.0.1:22222/api/v1/assets?search=2A9f8ywqBXsf0WlvjF2afA3uBIU2nef9') {
        return Promise.resolve(JSON.stringify([{transaction_id: '123'}]));
      }
      if (url === 'http://127.0.0.1:22222/api/v1/transactions/123') {
        return Promise.resolve(JSON.stringify({asset: {data: 1}}));
      }
      if (url === `http://127.0.0.1:22222/api/v1/outputs?public_key=6qHyZew94NMmUTYyHnkZsB8cxJYuRNEiEpXHe1ih9QX3`) {
        return Promise.resolve(JSON.stringify([{"transaction_id": 123}]));
      }
    }
  });

  beforeEach(() => {
  });
  describe('check service', () => {
    const services = {
      get: (service) => {
        if (service === 'configService') {
          return {
            get: (name) => {
              if (name === 'bigchainDbHost') return '127.0.0.1'
              if (name === 'bigchainDbPort') return '22222'
            }
          }
        }
      },
      add: () => null,
    };
    it('verify should return true', async() => {
      const activeService = activate(services);
      const verify = await activeService.verify('2A9f8ywqBXsf0WlvjF2afA3uBIU2nef9');
      expect(verify).to.eql(true);
    });
    it('getAll should return asset', async() => {
      const activeService = activate(services);
      const getAll = await activeService.getAll('6qHyZew94NMmUTYyHnkZsB8cxJYuRNEiEpXHe1ih9QX3');
      expect(getAll.length).to.eql(1);
    });
  });
});
