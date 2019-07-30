require('../../../../builds/devel/pskruntime');
//require('../../../../builds/devel/psknode');
var assert = require('double-check').assert;
var fs = require("fs");


$$.asset.describe("TestAgent", {
    public:{
        alias:"string:key",
        publicKey:"string"
    },
    init:function(alias, value){
        this.alias      = alias;
        this.publicKey  = value;
    }
});


$$.transaction.describe("TestTransaction", {
    addAgent: function (alias, publicKey) {
        var reference = $$.asset.start("TestAgent", "init", alias, publicKey);
        this.transaction.save(reference);
        $$.blockchain.persist(this.transaction);
    }
})

const storageFolder = "./storageFolder";

fs.unlink(storageFolder + "/history");
fs.unlink(storageFolder + "/cache");

var bm = require('../index');

var worldStateCache     =  blockchain.createWorldStateCache("none");
var historyStorage      =  blockchain.createHistoryStorage("memory");
var consensusAlgorithm  =  blockchain.createConsensusAlgorithm("direct");


bm.createBlockchain(worldStateCache, historyStorage, true);

const agentAlias = "Smoky";

assert.callback("Values should match", function(done){
    $$.blockchain.start(function(err, res){
        assert.null(err);
        $$.transactions.start("TestTransaction", "addAgent",agentAlias, "withoutPK");
        var agent = $$.blockchain.lookup("testAgent", agentAlias);
        assert.equal(agent.publicKey,"withoutPK");
        done();
    });
})


