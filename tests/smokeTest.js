
//require('../../../../builds/devel/psknode');
var assert = require('../../double-check').assert;
require('../../../psknode/bundles/pskruntime');
var bm = require('../index');

require('./testUtil/simplestConstitution');
/*
var tu = require('testUtil');
const storageFolder = "./storageFolder";
tu.deleteFolderRecursive(storageFolder); */


let  worldStateCache    =  bm.createWorldStateCache("memory");
let  historyStorage     =  bm.createHistoryStorage("memory");
let consensusAlgorithm  =  bm.createConsensusAlgorithm("direct");
let signatureProvider   =  bm.createSignatureProvider("permissive");


bm.createBlockchain(worldStateCache, historyStorage, consensusAlgorithm, signatureProvider);


const agentAlias = "Smoky";
assert.begin("Running simple smoke test for PSK blockchain ")

assert.callback("PK values should be persisted", function(done){
    $$.blockchain.start(function(err, res){
        assert.isNull(err);
        $$.blockchain.startTransactionAs("agent","Constitution", "addAgent",agentAlias, "PublicKey");
        let agent = $$.blockchain.lookup("Agent", agentAlias);
        assert.equal(agent.publicKey,"PublicKey");
        done();
    });
})


