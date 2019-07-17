require('../../../../builds/devel/pskruntime');
require('../../../../builds/devel/psknode');
var pskDB = require('pskdb');
const cutil = require('../../../signsensus/lib/consUtil');
var assert = require('double-check').assert;

var theGlobalBlockchain = pskDB.startDB('./testData'); // a.k.a. $$.blockchain
var transaction = theGlobalBlockchain.beginTransaction({});
var pdsStorage = transaction.getHandler();

pdsStorage.writeKey('k1', 'v1');
pdsStorage.writeKey('k2', 'v2');
pdsStorage.writeKey('k3', 'v3');

assert.callback('values should match', function(done) {
  assert.equal(pdsStorage.readKey('k1'), 'v1', "Results don't match!");
  assert.equal(pdsStorage.readKey('k2'), 'v2', "Results don't match!");
  assert.equal(pdsStorage.readKey('k3'), 'v3', "Results don't match!");
  done();
});
