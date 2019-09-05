const Blockchain = require('./Blockchain');

module.exports = {
    startDB: function (worldStateCache, historyStorage, consensusAlgorithm, signatureProvider, loadDefaultConstitution) {
        if(loadDefaultConstitution){
            require('../defaultConstitution/assets/index');
            require('../defaultConstitution/transactions/index');
        }
        let pds = require('./pskdb').newPSKDB(worldStateCache, historyStorage);
        consensusAlgorithm.pskdb = pds;
        return new Blockchain(pds, consensusAlgorithm, worldStateCache, signatureProvider);
    },
    startDefaultDB: function (worldStateCache, historyStorage, consensusAlgorithm, signatureProvider, loadDefaultConstitution, forceReboot) {
        if ($$.blockchain && !forceReboot) {
            $$.exception('$$.blockchain is already defined. Throwing an exception!');
        }
        if(!worldStateCache || !historyStorage || !consensusAlgorithm || !signatureProvider){
            console.error("Initialisation failed with arguments:", worldStateCache, historyStorage, consensusAlgorithm, signatureProvider);
            $$.exception('$$.blockchain initialisation failed! Throwing an exception!');
        }
        $$.blockchain = this.startDB(worldStateCache, historyStorage, consensusAlgorithm, signatureProvider, loadDefaultConstitution);
        return $$.blockchain;
    }
};
