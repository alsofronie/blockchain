require('../../../psknode/bundles/pskruntime');
//require('../../../../builds/devel/psknode');
var assert = require('double-check').assert;

require('testUtil/simplestConstitution');

var tu = require('testUtil');
const storageFolder = "./storageFolder";
tu.deleteFolderRecursive(storageFolder);

var bm = require('../index');

var worldStateCache     =  bm.createWorldStateCache("fs", storageFolder);
var historyStorage      =  bm.createHistoryStorage("fs", storageFolder);
var consensusAlgorithm  =  bm.createConsensusAlgorithm("direct");


bm.createBlockchain(worldStateCache, historyStorage, consensusAlgorithm);

const agentAlias = "Smoky";
assert.begin("Running folder persistence smoke test for PSK blockchain")

function restartBlockchain(done){
    var worldStateCache     =  bm.createWorldStateCache("fs", storageFolder);
    var historyStorage      =  bm.createHistoryStorage("fs", storageFolder);
    var consensusAlgorithm  =  bm.createConsensusAlgorithm("direct");
    bm.createBlockchain(worldStateCache, historyStorage, consensusAlgorithm, false, true);
    $$.blockchain.start(function(err, res){
        var agent = $$.blockchain.lookup("Agent", agentAlias);
        assert.equal(agent.publicKey,"withoutPK");
        done();
    })
}

function restartBlockchainWithoutCache(done){
    var worldStateCache     =  bm.createWorldStateCache("none" );
    var historyStorage      =  bm.createHistoryStorage("fs", storageFolder);
    var consensusAlgorithm  =  bm.createConsensusAlgorithm("direct");
    bm.createBlockchain(worldStateCache, historyStorage, consensusAlgorithm, false, true);
    $$.blockchain.start(function(err, res){
        var agent = $$.blockchain.lookup("Agent", agentAlias);
        assert.equal(agent.publicKey,"withoutPK");
        done();
    })
}

assert.callback("PK values should be persisted", function(done){
    $$.blockchain.start(function(err, res){
        assert.isNull(err);
        $$.transactions.start("Constitution", "addAgent","superMan", "withoutPK");
        $$.transactions.start("Constitution", "addAgent",agentAlias, "withoutPK");

        restartBlockchain(function(){
            restartBlockchainWithoutCache(done)
        });
    });
})





