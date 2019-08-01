function FsHistoryStorage(path){
    var observer;
    //send to callback all blocks newer then fromVSD
    this.observeNewBlocks = function(fromVSD, callback){
        observer = callback;
    }

    this.saveBlock = function(block,announce){

    }
}


function MemoryStorage(){
    var observer;
    //send to callback all blocks newer then fromVSD
    this.observeNewBlocks = function(fromVSD, callback){
        observer = callback;
    }

    this.saveBlock = function(block, announce){

    }
}

module.exports = {
    createStorage:function(storageType,...args){
        switch(storageType){
            case "fs": return new FsHistoryStorage(...args);
            case "memory": return new  MemoryStorage(...args);
            default:
                $$.exception("Unknown blockchain storage " + storageType);
        }
    }
}