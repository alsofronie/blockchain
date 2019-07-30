function DirectCommit(){
    this.commit = function(block,announce){

    }
}

module.exports = {
    createAlgorithm:function(name,...args){
        if(storageType == "none"){
            return new DirectCommit();
        } else {
            throw new Error("Unknown blockchain history storage with type " + storageType);
        }
    }
}