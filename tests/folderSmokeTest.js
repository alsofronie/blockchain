require('../../../psknode/bundles/pskruntime');
//require('../../../../builds/devel/psknode');
let dc = require('double-check');
var assert = dc.assert;
require('testUtil/simplestConstitution');

var tu = require('testUtil');
const storageFolder = "./__storageFolder";

dc.createTestFolder(storageFolder, mainTest);

assert.begin("Running folder persistence smoke test for PSK blockchain")

function mainTest(err, storageFolder) {

    //assert.disableCleanings(); //to debug it during development of the test

    var bm = require('../index');

    var worldStateCache = bm.createWorldStateCache("fs", storageFolder);
    var historyStorage = bm.createHistoryStorage("fs", storageFolder);
    var consensusAlgorithm = bm.createConsensusAlgorithm("direct");


    bm.createBlockchain(worldStateCache, historyStorage, consensusAlgorithm);

    const agentAlias = "Smoky";


    function restartBlockchainFromCache(done) {
        var worldStateCache = bm.createWorldStateCache("fs", storageFolder);
        var historyStorage = bm.createHistoryStorage("fs", storageFolder);
        var consensusAlgorithm = bm.createConsensusAlgorithm("direct");
        bm.createBlockchain(worldStateCache, historyStorage, consensusAlgorithm, false, true);
        $$.blockchain.start(function (err, res) {
            var agent = $$.blockchain.lookup("Agent", agentAlias);
            assert.equal(agent.publicKey, "withoutPK");
            done();
        })
    }

    function restartBlockchainWithoutCache(done) {
        var worldStateCache = bm.createWorldStateCache("none");
        var historyStorage = bm.createHistoryStorage("fs", storageFolder);
        var consensusAlgorithm = bm.createConsensusAlgorithm("direct");
        bm.createBlockchain(worldStateCache, historyStorage, consensusAlgorithm, false, true);
        $$.blockchain.start(function (err, res) {
            var agent = $$.blockchain.lookup("Agent", agentAlias);
            assert.equal(agent.publicKey, "withoutPK");
            done();
        })
    }

    assert.callback("PK values should be persisted", function (done) {
        $$.blockchain.start(function (err) {
            assert.isNull(err);
            $$.transactions.start("Constitution", "addAgent", "superMan", "withoutPK");
            $$.transactions.start("Constitution", "addAgent", agentAlias, "withoutPK");

            restartBlockchainFromCache(function () {
                restartBlockchainWithoutCache(done)
            });
        });
    })
}

