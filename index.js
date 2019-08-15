___DISABLE_OBSOLETE_ZIP_ARCHIVER_WAIT_FOR_BARS = true;
require("../../../psknode/bundles/pskruntime.js");
var callflowModule = require("callflow");
var pskcrypto = require("pskcrypto");

/*
    class for Command or Result transactions
 */
function CRTransaction(swarmType, command, input, output, currentPulse) {
    this.swarmType = swarmType;

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


var assetUtils = require("./blockchainSwarmTypes/asset");
var transactionUtils = require("./blockchainSwarmTypes/transaction");
$$.assets           = callflowModule.createSwarmEngine("asset", assetUtils);
$$.asset            = $$.assets;
$$.transactions     = callflowModule.createSwarmEngine("transaction", transactionUtils);
$$.transaction      = $$.transactions;


module.exports = {
    createBlockchain:function(worldStateCache, historyStorage, algorithm, loadDefaultConstitution, forcedBoot){
        return require("./pskdb").startDefaultDB(worldStateCache, historyStorage, algorithm, loadDefaultConstitution, forcedBoot);
    },
    createHistoryStorage:function(storageType,...args){
        return require("./strategies/historyStorages").createStorage(storageType,...args);
    },
    createWorldStateCache:function(storageType,...args){
        return require("./strategies/worldStateCaches").createCache(storageType,...args);
    },
    createConsensusAlgorithm:function(name,...args){
        return require("./strategies/consensusAlgortims").createAlgorithm(name,...args);
    },
    createCRTransaction:function (swarmType, command, input, output, currentPulse) {
        return new CRTransaction(swarmType, command, input, output, currentPulse);
    },
     createBlock:function (blockset, currentPulse) {
        return {blockset, currentPulse};
    },
    createSignatureProvider:function(){
        return require("./strategies/consensusAlgortims").createSignatureProvider(name,...args);
    }
}

