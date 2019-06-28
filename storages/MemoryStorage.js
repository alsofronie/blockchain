function MemoryStorage(){
    this.addBlock = function(blockAsJSON){

    }
    this.updateState = function(blockchainState){

    }

    this.loadState = function(callback){

    }
}


module.exports.create = function(foldername){

    return new MemoryStorage(foldername)
}