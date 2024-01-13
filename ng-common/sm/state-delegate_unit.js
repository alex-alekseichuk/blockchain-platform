'use strict';
const chai = require('chai');
const sinon = require('sinon');
const should = chai.should();
chai.use(require('sinon-chai'));

describe('State delegate', () => {
  let instance;
  const states = {
    state1: {
      apply: sinon.stub().returns(1)
    }
  };
  before(() => {
    const stateDelegate = require('./state-delegate');
    instance = stateDelegate.init(states);
  });
  describe('instance', () => {
    it('should return SmDelegate implementation', () => {
      instance.should.be.an('object');
      instance.apply.should.be.a('function');
    });
    it('should call apply implementation of appropriate state', () => {
      instance.apply('state1', 'payload1').should.equal(1);
      states.state1.apply.should.have.been.calledWith('payload1', 'state1');
    });
    it('should return nothing on incorrect state', () => {
      should.not.exist(instance.apply('stateUnknown', 'payload1'));
    });
  });
});
