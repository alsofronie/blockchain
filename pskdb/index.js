const Blockchain = require('./Blockchain');

module.exports = {
    startDB: function (worldStateCache, historyStorage, consensusAlgorithm, loadDefaultConstitution) {
        if(loadDefaultConstitution){
            require('../defaultConstitution/assets/index');
            require('../defaultConstitution/transactions/index');
        }
        let pds = require('./PDS').newPDS(worldStateCache, historyStorage);
        return new Blockchain(pds, consensusAlgorithm);
    },
    startDefaultDB: function (worldStateCache, historyStorage, algorithm, loadDefaultConstitution) {
        if ($$.blockchain) {
            $$.exception('$$.blockchain is already defined. Throwing an exception,');
        }
        $$.blockchain = this.startDB(worldStateCache, historyStorage, algorithm, loadDefaultConstitution);
        return $$.blockchain;
    }
};
