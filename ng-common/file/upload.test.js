'use strict';
const sinonChai = require("sinon-chai");
const chai = require('chai');
chai.should();
const chaiAsPromised = require('chai-as-promised');
chai.use(chaiAsPromised);
chai.use(sinonChai);

describe('Upload test', () => {
  const upload = require('./upload');

  describe('calc offset', () => {
    it('should calc correctly', async() => {
      const {offset, last} = await upload.calcOffset(0, 4, 4);
      (typeof offset).should.be.not.equal('undefined');
      (typeof last).should.be.not.equal('undefined');
      offset.should.be.equal(0);
      last.should.be.equal(4);
    });
  });

  describe('raw upload', () => {
    it('should upload correctly', async() => {
      const httpMock = {
        rawUpload: (uri, content, headers, callback) => {
          return callback({fileId: '123'});
        }
      };
      const res = await upload.rawUpload(httpMock, 'content', 'headers');
      res.should.be.equal('123');
    });
  });
});
