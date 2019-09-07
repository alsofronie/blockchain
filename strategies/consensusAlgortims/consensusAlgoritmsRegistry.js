var mod = require("../../index");

function DirectCommitAlgorithm(){
    this.pskdb = null;
    this.commit = function(transaction){
        const set = {};
        var cp = this.pskdb.getCurrentPulse();
        set[transaction.digest] = transaction;
        this.pskdb.commitBlock(mod.createBlock(set, cp, this.pskdb.getPreviousHash()));
        cp++;
        this.pskdb.setCurrentPulse(cp);
    }

    this.getCurrentPulse = function(){
        return this.pskdb.getCurrentPulse();
    }
}


function SignSensusAlgoritm(){
    this.pds = null;
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
            case "direct": return new DirectCommitAlgorithm(...args);
            case "SignSensus": return new  SignSensusAlgoritm(...args);
            default:
                $$.exception("Unknown consensu algortihm  " + name);
        }
    }
}