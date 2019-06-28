require('../../../../builds/devel/pskruntime');
require('../../../../builds/devel/psknode');
var assert = require('double-check').assert;
var pskDB = require('pskdb');

var theGlobalBlockchain = pskDB.startDB('./testData'); // a.k.a. $$.blockchain
var transaction = theGlobalBlockchain.beginTransaction({});
var pdsStorage = transaction.getHandler(); //a Storage instance created by InMemoryPDS

assert.callback('returned blockchain should be the global one', function(done) {
  assert.equal(theGlobalBlockchain, $$.blockchain, "Results don't match!");
  done();
});
assert.callback("'cset' values should match", function(done) {
  assert.equal(pdsStorage.readKey('k1'), 'v1', "Results don't match!");
  assert.equal(pdsStorage.readKey('k2'), 'v2', "Results don't match!");
  assert.equal(pdsStorage.readKey('k3'), 'v3', "Results don't match!");
  done();
});
