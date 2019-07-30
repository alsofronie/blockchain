require('../../../../builds/devel/pskruntime');
//require('../../../../builds/devel/psknode');
var assert = require('double-check').assert;
var fs = require("fs");

const storageFolder = "./storageFolder";

fs.unlink(storageFolder+"/history");
fs.unlink(storageFolder+"/cache");

var bm = require('../index');

var worldStateCache     =  blockchain.createWorldStateCache("fs",storageFolder);
var historyStorage      =  blockchain.createHistoryStorage("fs", storageFolder);

bm.createBlockchain(worldStateCache, historyStorage, true);

$$.blockchain.start(function(err, res){

    assert.null(err);

    const transaction = $$.blockchain.beginTransaction({});
    var alias = "Smoky";

    const agentAsset = transaction.lookup('global.Agent', agent);

    agentAsset.init(alias, "publicKey");
    try {
        transaction.add(agentAsset);
        $$.blockchain.commit(transaction);
    } catch (err) {
        this.return(new Error("Agent already exists"));
        return;
    }


    const testTransaction = $$.blockchain.beginTransaction({});

    var lookupAgent = transaction.lookup('global.Agent', agent);

    assert.callback('Values should match', function(done) {
        assert.equal(lookupAgent.alias,alias);
        done();
    });
});


