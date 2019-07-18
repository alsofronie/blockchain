function FsHistoryStorage(path){
    console.log(path);
    var observer;
    //send to callback all blocks newer then fromVSD
    this.observeNewBlocks = function(fromVSD, callback){
        observer = callback;
    }

    this.saveBlock = function(block,announce){

    }
}

module.exports = {
    createStorage:function(storageType,...args){
        if(storageType == "fs"){
            return new FsHistoryStorage(...args);
        } else {
            throw new Error("Unknown blockchain history storage with type " + storageType);
        }
    }
}