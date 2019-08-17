let CNST = require("../moduleConstants");

function KeyValueDBWithVersions(){ //main storage
    let cset        = {};  // contains all keys
    let keyVersions = {};  //will store versions
    let self = this;

    this.readKey = function (keyName){
        if(keyVersions.hasOwnProperty(keyName)){
            return cset[keyName];
        }
        keyVersions[keyName] = 0;
        return null;
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
        return 0;
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

    this.readKey = function (keyName){
        if(readSetVersions.hasOwnProperty(keyName)){
            return writeSet[keyName];
        }
        readSetVersions[keyName] = parentStorage.version(keyName);
        return parentStorage.readKey(keyName);
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

    var mainStorage = new KeyValueVersionStorage();
    var self = this;

    var currentPulse = 0;
    var hashOfLatestCommittedBlock = "Genesis Block";

    this.getHandler = function(){ // the single way of working with pskdb
        var tempStorage = new DBTransactionHandler(mainStorage);
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
        var cp = 0;

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

        function tryToBoot(){
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
            tryToBoot();
        }
        function gotState(err, val){
            gotState_done = true;

            if(!err){
                state = val;
            }
            if(state.latestBlockHash){
                hashOfLatestCommittedBlock = state.latestBlockHash;
            }
            tryToBoot();
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


function VerificationKeySpaceHandler(parentStorage, worldStateCache){
    let readSetVersions  = {}; //version of a key when read first time
    let writeSetVersions = {}; //increment version with each writeKey
    let writeSet         = {};  //contains only keys modified in handlers
    let self = this;

    this.readKey = function (keyName){
        if(writeSetVersions.hasOwnProperty(keyName)){
            return writeSet[keyName];
        }
        readSetVersions[keyName] = parentStorage.version(keyName);
        return parentStorage.readKey(keyName);
    }

    this.writeKey = function (keyName, value){
        this.readKey(keyName);         //save read version
        if(!writeSetVersions.hasOwnProperty(keyName)){
            writeSetVersions[keyName] = readSetVersions[keyName];
        }
        writeSetVersions[keyName]++;
        writeSet[keyName] = value;
    }

    function applyTransaction(t){
        let ret = true;
        for(let k in t.input){
            let transactionVersion = t.input[k];
            if( transactionVersion == undefined){
                transactionVersion = 0;
            }
            let currentVersion = self.getVersion(k);
            if(currentVersion == undefined || currentVersion == null){
                currentVersion = 0;
            }
            if(transactionVersion != currentVersion){
                //console.log(k, transactionVersion , currentVersion);
                //ret = "Failed to apply in transactionVersion != currentVersion (" + transactionVersion + "!="+ currentVersion + ")";
                return false;
            }
        }

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

        for(let k in t.output){
            self.writeKey(k, t.output[k]);
        }
        return ret;
    }

    this.computePTBlock = function(nextBlockSet){   //make a transactions block from nextBlockSet by removing invalid transactions from the key versions point of view
        var validBlock = [];
        var orderedByTime = cutil.orderTransactions(nextBlockSet);
        var i = 0;

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
            if(applyTransaction(t) && reportDropping){
                $$.log("Dropping transaction", t);
            };
            i++;
        }

        for(let v in writeSetVersions){
            parentStorage.writeKey(v, writeSet[v], writeSetVersions[v]);
        }
    }
}


exports.newPSKDB = function(worldStateCache, historyStorage){
    return new PSKDB(worldStateCache, historyStorage);
}