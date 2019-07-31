
function LocalWSCache(path){
    console.log(path);
    this.getState = function(callback){ //err, valuesFromCache

    }
}

function MemoryCache(){

    this.getState = function(callback){ //err, valuesFromCache

    }
}

module.exports = {
    createCache:function(cacheType,...args){
        switch(cacheType){
            case "fs": return new LocalWSCache(...args);
            case "memory": return new MemoryCache(...args);
            default:
                $$.exception("Unknown blockchain cache "+ cacheType);
        }
    }
}