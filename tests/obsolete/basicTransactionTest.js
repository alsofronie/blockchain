require("../../../../builds/devel/pskruntime");
const pskDB = require("pskdb");
const cutil = require("../../../signsensus/lib/consUtil");
const assert = require('double-check').assert;

const pds = pskDB.startDB("./storageFolder");


const flow = $$.flow.describe('basicTransactionTest', {
    start: function (callback){
        const swarm = {
            meta: {
                swarmName: 'swarm',
                swarmId: '123test'
            },
            swarmName: "Swarm"
        };

        this.addTransaction(swarm, () => {
            this.readTransaction(swarm, callback);
        });
    },
    addTransaction: function(swarm, callback) {
        const transaction = $$.blockchain.beginTransaction(swarm);

        const transactionSwarm = transaction.lookup('global.Key', 'testId');

        transaction.add(transactionSwarm);

        this.swarmId = transactionSwarm.getMeta('swarmId');

        $$.blockchain.commit(transaction);
        callback();
    },
    readTransaction: function(swarm, callback) {
        const transaction = $$.blockchain.beginTransaction(swarm);
        const transactionSwarm = transaction.lookup('global.Key', this.swarmId);

        assert.equal(transactionSwarm.getMeta('swarmId'), this.swarmId, 'Did not receive the same swarm');
        callback();
    }
})();


assert.callback('basicTransactionTest', function(callback) {
    flow.start(callback);
}, 2000);


