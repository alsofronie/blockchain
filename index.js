___DISABLE_OBSOLETE_ZIP_ARCHIVER_WAIT_FOR_BARS = true;
require("../../builds/devel/pskruntime.js");
require("callflow");
var pskcrypto = require("pskcrypto");

/*
    class for Command or Result transactions
 */
function CRTransaction(swarmType, command, input, output, currentPulse) {
    if(!command){
        this.input      = input;
        this.output     = output;
    } else {
        this.command      = command;
    }

    var arr = process.hrtime();
    this.second     = arr[0];
    this.nanosecod  = arr[1];
    this.CP         = currentPulse;
    this.digest     = pskcrypto.hashValues(this);
}

exports.createTransaction =

module.exports = {
    createBlockchain:function(worldStateCache, historyStorage, algorithm, loadDefaultConstitution){
        return require("./pskdb").startDefaultDB(worldStateCache, historyStorage, algorithm, loadDefaultConstitution);
    },
    createHistoryStorage:function(storageType,...args){
        return require("./historyStorages").createStorage(storageType,...args);
    },
    createWorldStateCache:function(storageType,...args){
        return require("./worldStateCaches").createCache(storageType,...args);
    },
    createConsensusAlgorithm:function(name,...args){
        return require("./consensusFactory").createAlgorithm(name,...args);
    },
    createCRTransaction:function (swarmType, command, input, output, currentPulse) {
        return new CRTransaction(swarmType, command, input, output, currentPulse);
    }
}