var assert 		= require('assert'),
	analytics 	= require('../analytics');

describe('test', function() {
  describe('email count', function () {
    it('should return 0', function () {
    	analytics({}).count('', function(count){
    		assert.equal(0, count);
    	});
    });
  });
});