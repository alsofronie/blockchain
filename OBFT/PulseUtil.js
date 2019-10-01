function PulseUtil(signer, currentPulseNumber, block, newTransactions, vsd, top, last) {
    this.signer         = signer;               //a.k.a. delegatedAgentName
    this.currentPulse   = currentPulseNumber;
    this.lset           = newTransactions;      //digest -> transaction
    this.ptBlock        = block;                //array of digests
    this.vsd            = vsd;
    this.top            = top;                  // a.k.a. topPulseConsensus
    this.last           = last;                 // a.k.a. lastPulseAchievedConsensus
}


module.exports.createPulse = function (signer, CP, CI, lset, top, last) {
    return new PulseUtil(signer, CP, CI, lset, vsd, top, last);
}


function PulseHistory(){

}

module.exports.createPulseHistory = function () {
    return new PulseHistory();
}