
function LocalWSCache(path){
    console.log(path);
    this.getState = function(callback){ //err, valuesFromCache

    }
}

module.exports = {
    createCache:function(cacheType,...args){
        if(cacheType == "fs"){
            return new LocalWSCache(...args);
        } else {
            throw new Error("Unknown cache type " + cacheType);
        }
    }
}