const Blockchain = require('./Blockchain');

module.exports = {
    startDB: function (worldStateCache, historyStorage, algorithm, loadDefaultConstitution) {
        if(loadDefaultConstitution){
            require('../defaultConstitution/assets/index');
            require('../defaultConstitution/transactions/index');
        }
        let pds = require('./InMemoryPDS').newPDS(worldStateCache, historyStorage, algorithm);
        return new Blockchain(pds);
    },
    startDefaultDB: function (worldStateCache, historyStorage, algorithm, loadDefaultConstitution) {
        if ($$.blockchain) {
            $$.exception('$$.blockchain is already defined. Throwing an exception,');
        }
        $$.blockchain = this.startDB(worldStateCache, historyStorage, algorithm, loadDefaultConstitution);
        return $$.blockchain;
    }
};
