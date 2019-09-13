var mod = require("../../index");

function DirectCommitAlgorithm(){
    let pskdb = null;
    this.setPSKDB = function(_pskdb){
        pskdb = _pskdb;
    }
    this.commit = function(transaction){
        const set = {};
        let cp = this.pskdb.getCurrentPulse();
        set[transaction.digest] = transaction;
        this.pskdb.commitBlock(mod.createBlock(set, cp, this.pskdb.getPreviousHash()));
        cp++;
        this.pskdb.setCurrentPulse(cp);
    }

    this.getCurrentPulse = function(){
        return this.pskdb.getCurrentPulse();
    }
}


function SignSensusAlgoritm(nodeName, networkImplementation, pulsePeriodicity, votingBox){
    let pskdb = null;
    let algorithm = null;
    this.setPSKDB = function(_pskdb){
        pskdb = _pskdb;
        algorithm = require("../../signsensus/SignSensusImplementation").createConsensusManager(nodeName, networkImplementation, pskdb, pulsePeriodicity, votingBox);
    }

    this.commit = function(transaction){
        algorithm.sendLocalTransactionToConsensus(transaction);
    }

    this.getCurrentPulse = function(){
        return algorithm.currentPulse;
    }
}

module.exports = {
    createAlgorithm:function(name,...args){
        switch(name){
            case "direct": return new DirectCommitAlgorithm(...args);
            case "SignSensus": return new  SignSensusAlgoritm(...args);
            default:
                $$.exception("Unknown consensus algortihm  " + name);
        }
    }
}