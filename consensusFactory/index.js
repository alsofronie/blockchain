function DirectCommitAlgoritm(){
    this.commit = function(transaction){
        $$.blockchain.commit(transaction);
    }
}


function SignSensusAlgoritm(){
    this.commit = function(transaction){
        $$.blockchain.commit(transaction);
    }
}

module.exports = {
    createAlgorithm:function(name,...args){
        switch(name){
            case "direct": return new DirectCommitAlgoritm();
            case "SignSensus": return new  SignSensusAlgoritm(...args);
            default:
                $$.exception("Unknown consensu algortihm  " + name);
        }
    }
}