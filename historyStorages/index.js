function FsHistoryStorage(folder){

    const blocksPath = folder+"/blocks";
    var fs = require("fs");

    var observer;
    //send to callback all blocks newer then fromVSD
    this.observeNewBlocks = function(fromVSD, callback){
        observer = callback;
    }

    this.appendBlock = function(block,announceFlag, callback){
        fs.writeFile(blocksPath, block.toString(), callback)
    }

    this.loadHistoryIteratively = function(from, to, eachBlockCallback){
    //readline
    }

    this.loadSpecificBlock = function(blockNumber,announce){
        fs.writeFile(blocksPath, block.toString(), callback)
    }
}


function MemoryStorage(){

    var blocks = [];
    var observer;
    //send to callback all blocks newer then fromVSD
    this.observeNewBlocks = function(fromVSD, callback){
        observer = callback;
    }

    this.appendBlock = function(block,announceFlag, callback){
        blocks.push(block);
    }

    this.loadHistoryIteratively = function(from, to, eachBlockCallback){
        if(to == "end"){
            to = blocks.length;
        }
        for(let i = from; i < to;i++){
            eachBlockCallback(blocks[i]);
        }
    }

    this.loadSpecificBlock = function(blockNumber,callback){
        callback(null, blocks[blockNumber]);
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