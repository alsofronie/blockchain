const Blockchain = require('./Blockchain');

module.exports = {
    startDB: function (worldStateCache, historyStorage, consensusAlgorithm, loadDefaultConstitution, signatureProvider) {
        if(loadDefaultConstitution){
            require('../defaultConstitution/assets/index');
            require('../defaultConstitution/transactions/index');
        }
        let pds = require('./pskdb').newPSKDB(worldStateCache, historyStorage);
        consensusAlgorithm.pskdb = pds;
        return new Blockchain(pds, consensusAlgorithm, worldStateCache, signatureProvider);
    },
    startDefaultDB: function (worldStateCache, historyStorage, algorithm, loadDefaultConstitution, forceReboot, signatureProvider) {
        if ($$.blockchain && !forceReboot) {
            $$.exception('$$.blockchain is already defined. Throwing an exception,');
        }
        $$.blockchain = this.startDB(worldStateCache, historyStorage, algorithm, loadDefaultConstitution, signatureProvider);
        return $$.blockchain;
    }
};
