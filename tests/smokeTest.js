require('../../../psknode/bundles/pskruntime');
//require('../../../../builds/devel/psknode');
var assert = require('double-check').assert;

require('testUtil/simplestConstitution');
/*
var tu = require('testUtil');
const storageFolder = "./storageFolder";
tu.deleteFolderRecursive(storageFolder); */

var bm = require('../index');

var worldStateCache     =  bm.createWorldStateCache("memory");
var historyStorage      =  bm.createHistoryStorage("memory");
var consensusAlgorithm  =  bm.createConsensusAlgorithm("direct");


bm.createBlockchain(worldStateCache, historyStorage, consensusAlgorithm);

const agentAlias = "Smoky";
assert.begin("Simple smoke test")

assert.callback("PK values should be persisted", function(done){
    $$.blockchain.start(function(err, res){
        assert.isNull(err);
        $$.transactions.start("Constitution", "addAgent",agentAlias, "withoutPK");
        var agent = $$.blockchain.lookup("Agent", agentAlias);
        assert.equal(agent.publicKey,"withoutPK");
        done();
    });
})


