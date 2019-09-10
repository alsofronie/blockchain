let  cfg = require("./simulationConfig").config;


var bm = require('../index');
require('./testUtil/simplestConstitution');

const storageFolder = "./__storageFolder";

dc.createTestFolder(storageFolder, mainTest);


let signatureProvider = bm.createSignatureProvider("permissive");


//network.init();
let numberTransactions = cfg.MAX_TRANSACTIONS;

while(numberTransactions > 0){
    setTimeout(function () {
        network.generateRandomTransaction();
        //console.log("New transaction!");
    }, getRandomInt(cfg.MAX_TRANSACTION_TIME));
    numberTransactions--;
}





toalGeneratedCounter = 0 ;
exports.generateRandomTransaction = function() {
    var nodeNumber = cutil.getRandomInt(cfg.MAX_NODES);
    var node = nodes[nodeNumber];
    var pdsHanlder = PDSFakes[nodeNumber].getHandler();

    var swarm = {
        swarmName: "Swarm:" + toalGeneratedCounter
    };

    var howMany = cutil.getRandomInt(cfg.MAX_KEYS_COUNT / 4) + 1;
    for (var i = 0; i < howMany; i++) {
        var keyName = "key" + cutil.getRandomInt(cfg.MAX_KEYS_COUNT);

        var dice = cutil.getRandomInt(6);

        if (dice == 0) {  //concurrency issues
            keyName = "sameKey";
            pdsHanlder.writeKey(keyName, cutil.getRandomInt(10000));
        }

        if (dice <= 4) {
            pdsHanlder.readKey(keyName);
        } else {
            pdsHanlder.writeKey(keyName, cutil.getRandomInt(10000));
        }
    }

    PDSFakes[nodeNumber].computeSwarmTransactionDiff(swarm, pdsHanlder);
    node.createTransactionFromSwarm(swarm);
    toalGeneratedCounter++;
}

exports.dumpVSDs = function(){
    nodes.forEach( node => node.dump());
}

exports.exportStatistics = function(){
    var results = [];
    nodes.forEach( node => {
        results.push(node.exportStatistics());
    });

    if(results.length<0){
        return {};
    }

    var stat = {};
    var indicators = Object.keys(results[0]);
    for(var i=0; i<indicators.length; i++){
        let ind = indicators[i];
        let value = 0;
        for(var j=0; j<nodes.length; j++){
            var newValue = results[j][ind];
            value += newValue;
        }
        stat[ind] = value/nodes.length;
    }
    return stat;
}