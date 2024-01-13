'use strict';
const chai = require('chai');
chai.should();
chai.use(require('sinon-chai'));

const testUtil = require('../util/test');

describe('Context module', () => {
  let contextBuilder;
  before(() => {
    contextBuilder = require('./index');
  });
  it('should have method create', () => {
    testUtil.hasMethods(contextBuilder, ['create']);
  });
  describe('context instance', () => {
    let context;
    before(() => {
      context = contextBuilder.create();
    });
    it('should have methods', () => {
      testUtil.hasMethods(context, ['clone', 'add', 'inject', 'reg', 'regAsync']);
    });
    describe('cloned context', () => {
      let clonedContext;
      before(() => {
        context.a = 'a1';
        context.b = 'b1';
        clonedContext = context.clone({b: 'b2', c: 'c2'});
      });
      it('should have properties of parent context', () => {
        clonedContext.d = 'd21';
        clonedContext.should.have.property('a', 'a1');
        clonedContext.should.have.property('b', 'b2');
        clonedContext.should.have.property('c', 'c2');
        context.should.have.property('b', 'b1');
      });
    });
    describe('add method', () => {
      it('should update implementation on second add call', () => {
        context.add('interface', {f: () => "impl1"});
        const instance = context.interface;
        instance.f().should.be.equal("impl1");
        context.add('interface', {f: () => "impl2"});
        instance.f().should.be.equal("impl2");
      });
      it('should not update implementation of direct dependency', () => {
        context.interface = {f: () => "impl1"};
        const instance = context.interface;
        instance.f().should.be.equal("impl1");
        context.add('interface', {f: () => "impl2"});
        instance.f().should.be.equal("impl1");
      });
      it('should not update parent context', () => {
        context.add('cloned1', {f: 'cloned1'});
        const clonedContext = context.clone();
        clonedContext.add('cloned1', {f: 'cloned2'});
        context.cloned1.f.should.be.equal('cloned1');
        clonedContext.cloned1.f.should.be.equal('cloned2');
      });
    });
    describe('load method', () => {
      it('should load dependency into the context', async () => {
        const factory = function sync1(a, b) {
          return {
            f: () => a + b
          };
        };
        const self = context.reg(factory, {b: 'load'});
        self.should.be.equal(context);
        context.should.have.property('sync1');
        context.sync1.f().should.be.equal('a1load');
      });
      it('should load a set of dependencies into the context', async () => {
        const factory = function sync1(a, b) {
          const main = {f11: () => 'f11'};
          main.__components = {main, second: {f12: () => 'f12'}};
          return main;
        };
        const self = context.reg(factory, {b: 'load'});
        self.should.be.equal(context);
        context.should.have.property('main');
        context.main.f11().should.be.equal('f11');
        context.should.have.property('second');
        context.second.f12().should.be.equal('f12');
      });
      it('should load promise dependency into the context', () => {
        const factoryP = async function asyncP(a, b) {
          return {
            f: () => a + b
          };
        };
        const selfP = context.reg(factoryP, {b: 'load'});
        selfP.then(self => {
          self.should.be.equal(context);
          context.should.have.property('asyncP');
          context.asyncP.should.have.property('f');
          context.asyncP.f.should.be.a('function');
          context.asyncP.f().should.be.equal('a1load');
        });
      });
      it('should load promise a set of dependencies into the context', () => {
        const factoryP = async function asyncP(a, b) {
          const main = {f21: () => 'f21'};
          main.__components = {main, second: {f22: () => 'f22'}};
          return main;
        };
        const selfP = context.reg(factoryP, {b: 'load'});
        selfP.then(self => {
          self.should.be.equal(context);
          context.should.have.property('main');
          context.main.should.have.property('f21');
          context.main.f21.should.be.a('function');
          context.main.f21().should.be.equal('f21');
          context.should.have.property('second');
          context.second.should.have.property('f22');
          context.second.f22.should.be.a('function');
          context.second.f22().should.be.equal('f22');
        });
      });
      it('should load async dependency into the context', async () => {
        const asyncFactory = async function async1(a, b) {
          return {
            f: () => a + b
          };
        };
        const self = await context.regAsync(asyncFactory, {b: 'load'});
        self.should.be.equal(context);
        context.should.have.property('async1');
        context.async1.f().should.be.equal('a1load');
      });
      it('should load async a set of dependencies into the context', async () => {
        const asyncFactory = async function async1(a, b) {
          const main = {f31: () => 'f31'};
          main.__components = {main, second: {f32: () => 'f32'}};
          return main;
        };
        const self = await context.regAsync(asyncFactory, {b: 'load'});
        self.should.be.equal(context);
        context.should.have.property('main');
        context.main.f31().should.be.equal('f31');
        context.should.have.property('second');
        context.second.f32().should.be.equal('f32');
      });
    });
  });
});
