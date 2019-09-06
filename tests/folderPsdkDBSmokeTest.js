let dc = require('../../double-check');

require('../../../psknode/bundles/pskruntime');
//require('../../../../builds/devel/psknode');

var assert = dc.assert;
var bm = require('../index');
require('./testUtil/simplestConstitution');

const storageFolder = "./__storageFolder";

dc.createTestFolder(storageFolder, mainTest);

assert.begin("Running folder persistence smoke test for PSK blockchain")

let signatureProvider = bm.createSignatureProvider("permissive");




function mainTest(err, storageFolder) {

    assert.disableCleanings(); //to debug it during development of the test

    let worldStateCache = bm.createWorldStateCache("fs", storageFolder);
    let historyStorage = bm.createHistoryStorage("fs", storageFolder);
    let consensusAlgorithm = bm.createConsensusAlgorithm("direct");
    let signatureProvider  =  bm.createSignatureProvider("permissive");

    bm.createBlockchain(worldStateCache, historyStorage, consensusAlgorithm, signatureProvider, false, false);

    const agentAlias = "Smoky";
    const agentAlias0 = "Smoky0";


    function restartBlockchainWithoutCache(done) {
        let worldStateCache = bm.createWorldStateCache("none");
        let historyStorage = bm.createHistoryStorage("fs", storageFolder);

        bm.createBlockchain(worldStateCache, historyStorage, consensusAlgorithm, signatureProvider, false, true);
        $$.blockchain.start(function (err, res) {
            $$.transactions.start("Constitution", "addAgent", agentAlias+"xxx", "XXXPublicKey");
            let agent = $$.blockchain.lookup("Agent", "superMan");
            assert.equal(agent.publicKey, "supermanPublicKey");
            done();
        })
    }

    assert.callback("PK values should be persisted", function (done) {
        $$.blockchain.start(function (err) {
            assert.isNull(err);
            $$.transactions.start("Constitution", "addAgent", agentAlias0, "Smoky0PublicKey");
            $$.transactions.start("Constitution", "addAgent", "superMan", "fakeSmokyPublicKey");
            $$.transactions.start("Constitution", "updatePublicKey", "superMan", "supermanPublicKey");
            let  agent = $$.blockchain.lookup("Agent", "superMan");

            assert.equal(agent.publicKey, "supermanPublicKey");
            $$.transactions.start("Constitution", "addAgent", agentAlias, "SmokyPublicKey");

            $$.blockchain.dump();
            //return done();
           restartBlockchainWithoutCache(done);
        });
    })
}

