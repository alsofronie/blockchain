
function KeyValueDBWithVersions(){
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

    this.writeKey = function (keyName, value){
        if(keyVersions.hasOwnProperty(keyName)){
            keyVersions[keyName]++;

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
            keyVersions,
            currentPulse
        }
    }
}

function TransactionKeySpaceHandler(parentStorage){
    let readSetVersions  = {}; //version of a key when read first time
    let writeSet         = {};  //contains only keys modified in handlers

    this.readKey = function (keyName){
        if(readSetVersions.hasOwnProperty(keyName)){
            return writeSet[keyName];
        }
        readSetVersions[keyName] = parentStorage.version(keyName);
        return parentStorage.readKey(keyName);
    }

    this.writeKey = function (keyName, value){
        this.readKey(keyName);         //save read version
        writeSet[keyName] = value;
    }

    this.computeSwarmTransactionDiff = function(swarmForTransaction){
        swarmForTransaction.input     = readSetVersions;
        swarmForTransaction.output    = writeSet;
        return swarmForTransaction;
    }
}


function PSKDb(worldStateCache, historyStorage){

    var mainStorage = new KeyValueVersionStorage();
    var self = this;

    var currentPulse = 0;
    var hashOfLatestCommittedBlock = "Genesis Block";

    this.getHandler = function(){ // the single way of working with pskdb
        var tempStorage = new TransactionKeySpaceHandler(mainStorage);
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
        mainStorage.commit(blockSet);

        hashOfLatestCommittedBlock = block.hash;
        if(!doNotSaveHistory){
            historyStorage.appendBlock( block, false, $$.logError);
        }

        let internalValues = mainStorage.getInternalValues(currentPulse);
        internalValues.latestBlockHash = block.hash;
        worldStateCache.updateState(internalValues, $$.logError);
    }

}



function VerificationKeySpaceHandler(parentStorage){
    let readSetVersions  = {}; //version of a key when read first time
    let writeSetVersions = {}; //increment version with each writeKey

    let writeSet         = {};  //contains only keys modified in handlers

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
}


exports.newPSKDB = function(worldStateCache, historyStorage){
    return new PDS(worldStateCache, historyStorage);
}