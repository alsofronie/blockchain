require('../../../psknode/bundles/pskruntime');
//require('../../../../builds/devel/psknode');
var assert = require('double-check').assert;
var bm = require('../index');

require('testUtil/simplestConstitution');


var worldStateCache     =  bm.createWorldStateCache("memory");
var historyStorage      =  bm.createHistoryStorage("memory");
var consensusAlgorithm  =  bm.createConsensusAlgorithm("direct");


bm.createBlockchain(worldStateCache, historyStorage, consensusAlgorithm);

const agentAlias = "Smoky";
assert.begin("Running simple smoke test for PSK blockchain ")

assert.callback("PK values should be persisted", function(done){
    $$.blockchain.start(function(err, res){
        assert.isNull(err);
        $$.transactions.start("Constitution", "addAgent",agentAlias, "withoutPK");
        var agent = $$.blockchain.lookup("Agent", agentAlias);
        assert.equal(agent.securityParadigm.mainParadigm , "Constitutional" );

        done();
    });
})


