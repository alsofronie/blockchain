let CNST = require("../moduleConstants");
var cutil   = require("../signsensus/consUtil");
//var ssutil  = require("pskcrypto");


function KeyValueDBWithVersions(worldStateCache){ //main storage
    let cset        = {};  // contains all keys
    let keyVersions = {};  //will store versions
    let self = this;

    this.dump = function(){
        //console.log("Main Storage", {keyVersions,cset})
        worldStateCache.dump();
    }

    this.readKey = function (keyName, mandatoryToExist){
        if(keyVersions.hasOwnProperty(keyName)){
            return cset[keyName];
        }
        if(mandatoryToExist){
            keyVersions[keyName] = 0;
        }
        return undefined;
    }

    this.writeKey = function (keyName, value, newVersion){

        if(keyVersions.hasOwnProperty(keyName)){
            if(!newVersion){
                keyVersions[keyName]++;
            } else {
                keyVersions[keyName] = newVersion;
            }
        } else{
            keyVersions[keyName] = 0;
        }
        cset[keyName] = value;
    }

    this.version = function(keyName){
        if(keyVersions.hasOwnProperty(keyName)){
            return keyVersions[keyName];
        }
        return undefined;
    }

    this.getInternalValues = function(currentPulse){
        return {
            cset,
            versions:keyVersions,
            currentPulse
        }
    }
}

function DBTransactionHandler(parentStorage){
    let readSetVersions  = {}; //version of a key when read first time
    let writeSet         = {};  //contains only keys modified in handlers

    this.dump = function(){
        console.log("DBTransactionHandler:", {readSetVersions,writeSet});
        parentStorage.dump();
    }

    this.readKey = function (keyName, mandatoryToExist){
        function internalReadKey(){
            if(readSetVersions.hasOwnProperty(keyName)){
                return writeSet[keyName];
            }
            let version = parentStorage.version(keyName);
            if(version != undefined){
                readSetVersions[keyName] = version;
            }
            return parentStorage.readKey(keyName);
        }

        let result = internalReadKey();
        writeSet[keyName] = result;
        /*
        if(mandatoryToExist){
            console.debug("Looking for ", keyName, " Version:", parentStorage.version(keyName), "Result:", result);
        }
        if(!result && mandatoryToExist){
            console.error("Found nothing for", keyName, "Key Version:", parentStorage.version(keyName));
            this.dump();
            $$.exception("Mandatory key not found:" + keyName);
        }*/
        return result;
    };

    this.writeKey = function (keyName, value){
        this.readKey(keyName);         //save read version
        writeSet[keyName] = value;
    };

    this.computeSwarmTransactionDiff = function(){
        return {
            input     : readSetVersions,
            output    : writeSet
        };
    };
}


function PSKDB(worldStateCache, historyStorage){

    let mainStorage = new KeyValueDBWithVersions(worldStateCache);
    let self = this;

    let currentPulse = 0;
    let hashOfLatestCommittedBlock = "Genesis Block";

    this.getHandler = function(){ // the single way of working with pskdb
        let tempStorage = new DBTransactionHandler(mainStorage);
        return tempStorage;
    }

    this.getCurrentPulse = function(){
        return currentPulse;
    }

    this.setCurrentPulse = function(cp){
        currentPulse = cp;
    }

    this.getPreviousHash = function(){
        return hashOfLatestCommittedBlock;
    }

    this.initialise = function(reportResultCallback){
        let gotLatestBlock_done = false;
        let gotState_done = false;
        let lbn = 0;
        let state = 0;
        let cp = 0;

        function loadNextBlock(){
            if(cp > lbn){
                if(lbn != 0){
                    currentPulse = cp;
                }
                reportResultCallback(null,lbn);
            } else {
                historyStorage.loadSpecificBlock(cp, function(err, block){
                    if(block){
                        self.commitBlock(block, true);
                        cp = block.pulse;
                    }
                    cp++;
                    loadNextBlock();
                })
            }
        }

        function loadMissingBlocksFromHistory(){
            if(gotState_done &&  gotLatestBlock_done){
                if(state && state.pulse){
                    cp = state.pulse;
                }
                console.log("Reloading from cache at pulse ", cp, "and rebuilding state until pulse", lbn);
                if(state.pulse){
                    mainStorage.initialiseInternalValue(state);
                }
                loadNextBlock();
            }
        }

        function gotLatestBlock(err, val){
            gotLatestBlock_done = true;
            if(!err){
                lbn = val;
            }
            loadMissingBlocksFromHistory();
        }

        function gotState(err, val){
            gotState_done = true;

            if(!err){
                state = val;
            }
            if(state.latestBlockHash){
                hashOfLatestCommittedBlock = state.latestBlockHash;
            }
            loadMissingBlocksFromHistory();
        }

        worldStateCache.getState(gotState);
        historyStorage.getLatestBlockNumber(gotLatestBlock);
    }



    this.commitBlock = function(block, doNotSaveHistory){
        let blockSet = block.blockset;
        currentPulse = block.pulse;

        let verificationKeySpace = new VerificationKeySpaceHandler(mainStorage, worldStateCache)

        verificationKeySpace.commit(blockSet);

        hashOfLatestCommittedBlock = block.hash;
        if(!doNotSaveHistory){
            historyStorage.appendBlock( block, false, $$.logError);
        }

        let internalValues = mainStorage.getInternalValues(currentPulse);
        internalValues.latestBlockHash = block.hash;
        worldStateCache.updateState(internalValues, $$.logError);
    }

    this.computePTBlock = function(nextBlockSet){
        var tempStorage = new DataShell(mainStorage);
        return tempStorage.computePTBlock(nextBlockSet);

    }
}

let lec = require("../strategies/securityParadigms/localExecutionCache");

    /* play the role of DBTransactionHandler (readKey, writeKey) while also doing transaction validation*/
function VerificationKeySpaceHandler(parentStorage, worldStateCache){
    let readSetVersions  = {}; //version of a key when read first time
    let writeSetVersions = {}; //increment version with each writeKey
    let writeSet         = {};  //contains only keys modified in handlers
    let self = this;

    let aliases = {};

    this.dump = function(){
        console.log("VerificationKeySpaceHandler:", {readSetVersions,writeSetVersions,writeSet});
        parentStorage.dump();
    }


    this.readKey = function (keyName){
        if(writeSetVersions.hasOwnProperty(keyName)){
            return writeSet[keyName];
        }
        readSetVersions[keyName] = parentStorage.version(keyName);
        return parentStorage.readKey(keyName);
    }

    this.saveAlias = function(assetType, alias, swarmId){
        aliases[swarmId] = {assetType, alias};
    }

    this.writeKey = function (keyName, value){
        this.readKey(keyName);         //save read version
        if(!writeSetVersions.hasOwnProperty(keyName)){
            writeSetVersions[keyName] = readSetVersions[keyName];
        }
        writeSetVersions[keyName]++;
        writeSet[keyName] = value;
    }

    this.version = function(keyName){
        if(writeSetVersions.hasOwnProperty(keyName)){
            return writeSetVersions[keyName];
        }
        return parentStorage.version(keyName);
    }

    function applyTransaction(t, willBeCommited){
        let ret = true;
        lec.ensureEventTransaction(t);
        for(let k in t.input){
            let transactionVersion = t.input[k];
            if( transactionVersion == undefined){
                transactionVersion = 0;
            }
            let currentVersion = self.version(k);
            if(currentVersion == undefined || currentVersion == null){
                currentVersion = 0;
            }
            if(transactionVersion != currentVersion){
                //console.log(k, transactionVersion , currentVersion);
                //ret = "Failed to apply in transactionVersion != currentVersion (" + transactionVersion + "!="+ currentVersion + ")";
                return false;
            }
        }

        //TODO: potential double spending bug if a transaction was replaced
        if(!lec.verifyTransaction(t, self, willBeCommited)){
            return false;
        }

        for(let k in t.output){
            self.writeKey(k, t.output[k]);
        }

        /* who has this responsability?
        if(willBeCommited){
            lec.removeFromCacheAtCommit(t);
        }*/
        return ret;
    }

    this.computePTBlock = function(nextBlockSet){   //make a transactions block from nextBlockSet by removing invalid transactions from the key versions point of view
        let validBlock = [];
        let orderedByTime = cutil.orderTransactions(nextBlockSet);
        let i = 0;

        while(i < orderedByTime.length){
            let t = orderedByTime[i];
            if(applyTransaction(t)){
                validBlock.push(t.digest);
            }
            i++;
        }
        return validBlock;
    }

    this.commit = function(blockSet, reportDropping){
        let i = 0;
        let orderedByTime = cutil.orderCRTransactions(blockSet);

        while( i < orderedByTime.length ){
            let t = orderedByTime[i];
            if(applyTransaction(t, true) && reportDropping){
                $$.log("Dropping transaction", t);
            };
            i++;
        }

        for(let v in writeSetVersions){
            parentStorage.writeKey(v, writeSet[v], writeSetVersions[v]);
        }

        worldStateCache.updateAliases(aliases);
    }
}


exports.newPSKDB = function(worldStateCache, historyStorage){
    return new PSKDB(worldStateCache, historyStorage);
}