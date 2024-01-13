'use strict';
const chai = require('chai');
chai.should();
chai.use(require("chai-as-promised"));
const sinon = require('sinon');
chai.use(require("sinon-chai"));

// mocks
const loopbackApp = {
  plugin_manager: {
    configs: {
      get: () => null,
      status: () => null
    }
  }
};
const configService = {
  get: () => null
};
const serviceManagerMethods = {loopbackApp, configService};
const serviceManager = {
  get: serviceName => serviceManagerMethods[serviceName] || sinon.stub(),
  add: () => null
};

const req = {
  get: () => null,
  cookies: {},
  query: {},
  accepted: [{value: 'application/json'}]
};
const res = {
  status: () => null,
  send: () => null,
  end: () => null
};

describe('JwtCheckService', () => {
  const serviceFactory = require('../../../../api/services/service');

  describe('ensureAccessToken() on 401', () => {
    let service;
    let resStatus;
    let pluginConfigGet;
    let resSend;
    let json401Reply;
    let cb;

    beforeEach(() => {
      resStatus = sinon.stub(res, 'status').returns(res);
      pluginConfigGet = sinon.stub(loopbackApp.plugin_manager.configs, 'get')
        .returns({
          get: key => key === 'json401Reply' ? json401Reply : undefined
        });
      resSend = sinon.spy(res, 'send');

      service = serviceFactory.activate(serviceManager);
      cb = sinon.spy();
    });

    afterEach(() => {
      cb.should.not.have.been.called;
      resStatus.should.have.been.calledWith(401);

      resStatus.restore();
      pluginConfigGet.restore();
      resSend.restore();
    });

    it('should response JSON with message', () => {
      json401Reply = true;
      service.ensureAccessToken(req, res, cb);
      resSend.should.have.been.calledWith({message: 'Unauthorized'});
    });

    it("should not response JSON with message if it's turned off", () => {
      json401Reply = false;
      service.ensureAccessToken(req, res, cb);
      resSend.should.not.have.been.calledOnce;
    });
  });
});
