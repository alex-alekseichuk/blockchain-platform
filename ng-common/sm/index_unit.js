'use strict';
const chai = require('chai');
const sinon = require('sinon');
chai.use(require('sinon-chai'));

describe('SM', () => {
  let sm;
  const states = {
    state1: {
      apply: sinon.stub(),
      actions: {
        action11: 'state2',
        action12: () => 'state2',
        action13: () => Promise.resolve('state2'),
        action14: () => {
          return {
            state: 'state2',
            payload: 'payload2'
          };
        },
        action15: () => Promise.resolve({state: 'state2', payload: 'payload2'})
      }
    },
    state2: {
      apply: sinon.stub()
    }
  };
  before(() => {
    sm = require('./index');
  });
  describe('init method', () => {
    it('should return SM instance', () => {
      sm.init({states}).should.be.an('object');
    });
    it('should call apply of the initial state', () => {
      sm.init({states}, 'state1', 'payload1').should.be.an('object');
      setTimeout(() => {
        states.state1.apply.should.have.been.calledWith('payload1', 'state1');
      }, 100);
    });
  });
  describe('initWithDelegate method', () => {
    let delegate;
    beforeEach(() => {
      delegate = {apply: sinon.stub()};
    });
    it('should return SM instance', () => {
      sm.init({delegate, states}).should.be.an('object');
    });
    it('should call apply of the initial state', () => {
      sm.init({delegate, states}, 'state1', 'payload1').should.be.an('object');
      setTimeout(() => {
        delegate.apply.should.have.been.calledWith('state1', 'payload1');
      }, 100);
    });
  });
  describe('instance', () => {
    let instance;
    beforeEach(() => {
      instance = sm.init({states}, 'state1');
    });
    it('should have action method', () => {
      instance.action.should.be.a('function');
    });
    describe('on string simple action', () => {
      it('should change state property and call new state apply method', () => {
        instance.action('action11', 'payload1');
        instance.state.should.equal('state2');
        states.state2.apply.should.have.been.calledWith('payload1', 'state2');
      });
    });
    describe('on function sync simple action', () => {
      it('should change state property and call new state apply method', () => {
        instance.state.should.equal('state1');
        instance.action('action12', 'payload1');
        instance.state.should.equal('state2');
        states.state2.apply.should.have.been.calledWith('payload1', 'state2');
      });
    });

    describe('on function promise simple action', () => {
      it('should change state property and call new state apply method', async () => {
        instance.state.should.equal('state1');
        await instance.action('action13', 'payload1');
        instance.state.should.equal('state2');
        states.state2.apply.should.have.been.calledWith('payload1', 'state2');
      });
    });

    describe('on function sync complex action', () => {
      it('should change state property and call new state apply method', () => {
        instance.state.should.equal('state1');
        instance.action('action14', 'payload1');
        instance.state.should.equal('state2');
        states.state2.apply.should.have.been.calledWith('payload2', 'state2');
      });
    });

    describe('on function promise complex action', () => {
      it('should change state property and call new state apply method', async () => {
        instance.state.should.equal('state1');
        await instance.action('action15', 'payload1');
        instance.state.should.equal('state2');
        states.state2.apply.should.have.been.calledWith('payload2', 'state2');
      });
    });
  });
});
