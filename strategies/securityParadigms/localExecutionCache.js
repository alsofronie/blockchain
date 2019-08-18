let CNST=require("../../moduleConstants");
let cache = {};

let alreadyVerified = {

};

function sandBoxedExecution(cet){
    let transactionType = cet.swarmType;
    $$.transactions.start("")
}

exports = {
    ensureEventTransaction:function(cetransaction){

        return cetransaction;
    },
    verifyTransaction:function(t, handler, forceDeepVerification){
        let assets = [];
        let fastCheck = true;
        for(let k in t.output){
            let assetValue = JSON.parse(self.readKey(k));
            let asset = $$.assets.continue(assetValue);
            if(asset.securityParadigm.mainParadigm == CNST.CONSTITUTIONAL){
                fastCheck = false;
            }
            assets.push(asset);
        }

        if(fastCheck){

        } else {
            //execute transaction again and see if the results are identical

        }
    },
    removeFromCacheAtCommit:function(t){
        delete alreadyVerified[t.digest];
        delete cache[t.digest];
    }
};
