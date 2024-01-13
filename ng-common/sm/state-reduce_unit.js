'use strict';
const chai = require('chai');
const sinon = require('sinon');
const should = chai.should();
chai.use(require('sinon-chai'));

describe('State reducer', () => {
  let instance;
  const states = {
    state1: {
    },
    state2: {
      apply: sinon.stub(),
      actions: {}
    },
    state3: {
      actions: {
        incorrectAction: null,
        action31: 'state1',
        action35: () => 'state5',
        action32: sinon.stub().returns('state2'),
        action34: sinon.stub().resolves('state4')
      }
    },
    state4: {
      apply: sinon.stub()
    }
  };
  before(() => {
    const stateReducer = require('./state-reducer');
    instance = stateReducer.init(states);
  });
  describe('instance', () => {
    it('should return SmReducer implementation', () => {
      instance.should.be.an('object');
      instance.reduce.should.be.a('function');
    });
  });
  describe('reduce method on unknown action', () => {
    it('should return null', () => {
      should.not.exist(instance.reduce('state3', 'actionUnknown', 'payload1'));
    });
  });
  describe('reduce method on incorrect action', () => {
    it('should return null', () => {
      instance.reduce('state3', 'action35', 'payload1').should.equals('state5');
    });
  });
  describe('reduce method on action of simple type', () => {
    it('should return new state', () => {
      instance.reduce('state3', 'action31', 'payload1').should.equal('state1');
    });
  });
  describe('reduce method on action of pure function type', () => {
    it('should return new state', () => {
      instance.reduce('state3', 'action32', 'payload1').should.equal('state2');
      states.state3.actions.action32.should.have.been.calledWith('payload1', 'state3');
    });
  });
  describe('reduce method on action of promise function type', () => {
    it('should return new state on function state change', async () => {
      (await instance.reduce('state3', 'action34', 'payload1')).should.equal('state4');
      states.state3.actions.action34.should.have.been.calledWith('payload1', 'state3');
    });
  });
});
