const Blockchain = require('./lib/Blockchain');

module.exports = {
    startDB: function (storage, loadDefaultConstitution) {
        if(loadDefaultConstitution){
            require('../defaultConstitution/assets/index');
            require('../defaultConstitution/transactions/index');
        }
        let pds = require('./lib/InMemoryPDS').newPDS(storage);
        return new Blockchain(pds);
    },
    startDefaultDB: function (storage, loadDefaultConstitution) {
        if ($$.blockchain) {
            throw new Error('$$.blockchain is already defined');
        }
        $$.blockchain = this.startDB(storage, loadDefaultConstitution);
        return $$.blockchain;
    }
};
