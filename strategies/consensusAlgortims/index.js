var mod = require("../../index");

function DirectCommitAlgorithm(){
    var currentPulse = 0;
    this.commit = function(pds, transaction){
        const set = {};
        set[transaction.digest] = transaction;
        pds.commit(mod.createBlock(set, currentPulse));
        currentPulse++;
    }

    this.getCurrentPulse = function(){
        return currentPulse;
    }
}


function SignSensusAlgoritm(){

    this.commit = function(pds, transaction){
        $$.blockchain.commit(transaction);
    }
    this.getCurrentPulse = function(){
        return 0;
    }
}

module.exports = {
    createAlgorithm:function(name,...args){
        switch(name){
            case "direct": return new DirectCommitAlgorithm();
            case "SignSensus": return new  SignSensusAlgoritm(...args);
            default:
                $$.exception("Unknown consensu algortihm  " + name);
        }
    }
}