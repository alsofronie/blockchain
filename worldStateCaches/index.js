
function LocalWSCache(path){
    console.log(path);
    this.getState = function(callback){ //err, valuesFromCache

    }

    this.updateState = function(internalValues){
        console.log("Commiting in folder cahce ", internalValues)
    }
}

function MemoryCache(){

    this.getState = function(callback){ //err, valuesFromCache

    }

    this.updateState = function(internalValues){
        console.info("Commiting state in memory cache "/*, internalValues*/)
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