const Blockchain = require('./Blockchain');

module.exports = {
    startDB: function (worldStateCache, historyStorage, consensusAlgorithm, loadDefaultConstitution) {
        if(loadDefaultConstitution){
            require('../defaultConstitution/assets/index');
            require('../defaultConstitution/transactions/index');
        }
        let pds = require('./obsolete/PDS').newPDS(worldStateCache, historyStorage);
        consensusAlgorithm.pskdb = pds;
        return new Blockchain(pds, consensusAlgorithm, worldStateCache);
    },
    startDefaultDB: function (worldStateCache, historyStorage, algorithm, loadDefaultConstitution, forceReboot) {
        if ($$.blockchain && !forceReboot) {
            $$.exception('$$.blockchain is already defined. Throwing an exception,');
        }
        $$.blockchain = this.startDB(worldStateCache, historyStorage, algorithm, loadDefaultConstitution);
        return $$.blockchain;
    }
};
