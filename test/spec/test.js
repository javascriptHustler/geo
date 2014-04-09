/*global describe, it */
'use strict';
  
describe('Give it some context', function () {
  describe('maybe a bit more context here', function () {
    it('should run here few assertions', function () {
      var foo = 'bar';
      var beverages = { tea: [ 'chai', 'matcha', 'oolong' ] };
      foo.should.be.a('string');
      foo.should.equal('bar');
      foo.should.have.length(3);
      beverages.should.have.property('tea').with.length(3);
    });
  });
});

