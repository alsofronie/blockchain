let CNST=require("../../moduleConstants");
let cache = {};

let alreadyVerified = {

};

function sandBoxedExecution(cet){
    let transactionType = cet.swarmType;
    $$.transactions.start("")
}

module.exports = {
    ensureEventTransaction:function(cetransaction){
        return cetransaction;
    },
    verifyTransaction:function(t, handler, forceDeepVerification){
        return true;
        let assets = {};
        let fastCheck = true;

        if(!forceDeepVerification){
            let t = cache[t.digest];
            if(typeof t != undefined) return true;
        }

        for(let k in t.output){
            let  value = handler.readKey(k);
            console.log("Value for key",k, value)
            if(value === undefined){
                    /* new asset (did not exist before current transaction)*/

            } else {
                let assetValue = JSON.parse(value);
                let asset = $$.assets.continue(assetValue);
                if(asset.securityParadigm.mainParadigm == CNST.CONSTITUTIONAL){
                    fastCheck = false;
                }
                assets[k].push(asset);
            }
        }

        if(fastCheck){
            //check the signatures or other rules specified in security paradigms
        } else {
            //execute transaction again and see if the results are identical
        }
        cache[t.digest] = t;
        return true;
    },
    removeFromCacheAtCommit:function(t){
        delete alreadyVerified[t.digest];
        delete cache[t.digest];
    }
};
