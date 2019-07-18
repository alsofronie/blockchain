const Blockchain = require('./lib/Blockchain');

module.exports = {
    startDB: function (worldStateCache, historyStorage, loadDefaultConstitution) {
        if(loadDefaultConstitution){
            require('../defaultConstitution/assets/index');
            require('../defaultConstitution/transactions/index');
        }
        let pds = require('./lib/InMemoryPDS').newPDS(worldStateCache, historyStorage);
        return new Blockchain(pds);
    },
    startDefaultDB: function (worldStateCache, historyStorage, loadDefaultConstitution) {
        if ($$.blockchain) {
            $$.exception('$$.blockchain is already defined. Throwing an exception,');
        }
        $$.blockchain = this.startDB(worldStateCache, historyStorage, loadDefaultConstitution);
        return $$.blockchain;
    }
};
