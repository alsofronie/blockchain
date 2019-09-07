___DISABLE_OBSOLETE_ZIP_ARCHIVER_WAIT_FOR_BARS = true;
require("../../../psknode/bundles/pskruntime.js");
var callflowModule = require("callflow");
var pskcrypto = require("pskcrypto");

/*
    class for Command or Result transactions
 */
function CRTransaction(swarmType, command, input, output, currentPulse) {
    this.swarmType = swarmType;

    if(input && output){
        this.input      = input;
        this.output     = output;
    }
    this.command      = command;

    let arr = process.hrtime();
    this.second     = arr[0];
    this.nanosecod  = arr[1];
    this.transactionPulse = currentPulse;
    this.digest     = pskcrypto.hashValues(this);
}


let assetUtils = require("./blockchainSwarmTypes/asset_swarm_template");
let transactionUtils = require("./blockchainSwarmTypes/transaction_swarm_template");
$$.assets           = callflowModule.createSwarmEngine("asset", assetUtils);
$$.asset            = $$.assets;
$$.transactions     = callflowModule.createSwarmEngine("transaction", transactionUtils);
$$.transaction      = $$.transactions;

let pskcryt = require("pskcrypto");


module.exports = {
    createBlockchain:function(worldStateCache, historyStorage, consensusAlgorithm, signatureProvider, loadDefaultConstitution, forcedBoot){
        return require("./pskdb").startDefaultDB(worldStateCache, historyStorage, consensusAlgorithm, signatureProvider, loadDefaultConstitution, forcedBoot);
    },
    createHistoryStorage:function(storageType,...args){
        return require("./strategies/historyStorages/historyStoragesRegistry").createStorage(storageType,...args);
    },
    createWorldStateCache:function(storageType,...args){
        return require("./strategies/worldStateCaches/worldStateCacheRegistry").createCache(storageType,...args);
    },
    createConsensusAlgorithm:function(name,...args){
        return require("./strategies/consensusAlgortims/consensusAlgoritmsRegistry").createAlgorithm(name,...args);
    },
    createCRTransaction:function (swarmType, command, input, output, currentPulse) {
        return new CRTransaction(swarmType, command, input, output, currentPulse);
    },
     createBlock:function (blockset, pulse, previous) {
        var block = {blockset, pulse, previous};
        block.hash = pskcryt.hashValues(block);
        return block;

    },
    createSignatureProvider:function(name,...args){
        return require("./strategies/signatureProvidersRegistry/signatureProvidersRegistry").createSignatureProvider(name,...args);
    }
}

