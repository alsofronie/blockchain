require('../../../psknode/bundles/pskruntime');
//require('../../../../builds/devel/psknode');
let dc = require('double-check');
var assert = dc.assert;
var bm = require('../index');
require('testUtil/simplestConstitution');

var tu = require('testUtil');
const storageFolder = "./__storageFolder";

dc.createTestFolder(storageFolder, mainTest);

assert.begin("Running folder persistence smoke test for PSK blockchain")

let signatureProvider = bm.createSignatureProvider("permissive");




function mainTest(err, storageFolder) {

    assert.disableCleanings(); //to debug it during development of the test



    var worldStateCache = bm.createWorldStateCache("fs", storageFolder);
    var historyStorage = bm.createHistoryStorage("fs", storageFolder);
    var consensusAlgorithm = bm.createConsensusAlgorithm("direct");



    bm.createBlockchain(worldStateCache, historyStorage, consensusAlgorithm, false, false, signatureProvider);

    const agentAlias = "Smoky";


    function restartBlockchainWithoutCache(done) {
        var worldStateCache = bm.createWorldStateCache("none");
        var historyStorage = bm.createHistoryStorage("fs", storageFolder);
        var consensusAlgorithm = bm.createConsensusAlgorithm("direct");
        bm.createBlockchain(worldStateCache, historyStorage, consensusAlgorithm, false, true, signatureProvider);
        $$.blockchain.start(function (err, res) {
         //   $$.transactions.start("Constitution", "addAgent", agentAlias+"xxx", "withoutPK");
            var agent = $$.blockchain.lookup("Agent", "superMan");
            assert.equal(agent.publicKey, "superMan_fakePK");
            done();
        })
    }

    assert.callback("PK values should be persisted", function (done) {
        $$.blockchain.start(function (err) {
            assert.isNull(err);
            $$.transactions.start("Constitution", "addAgent", "superMan", "withoutPK");
            $$.transactions.start("Constitution", "updatePublicKey", "superMan", "superMan_fakePK");

            var agent = $$.blockchain.lookup("Agent", "superMan");

            assert.equal(agent.publicKey, "superMan_fakePK");
          //  $$.transactions.start("Constitution", "addAgent", agentAlias, "withoutPK");

            restartBlockchainWithoutCache(done);
        });
    })
}

