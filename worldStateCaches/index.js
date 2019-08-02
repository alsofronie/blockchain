


function LocalWSCache(folder){
    const worldStateCachePath = folder+"/worldSateCache";
    var fs = require("fs");

    this.getState = function(callback){ //err, valuesFromCache
        fs.readFile(worldStateCachePath, function(err,res){
            $$.checkError(err,callback);
            let objRes = JSON.parse(res);
            callback(null, objRes);
        });
    }

    this.updateState = function(internalValues, callback){
        fs.writeFile(worldStateCachePath, JSON.stringify(internalValues), callback);
    }
}

function MemoryCache(){

    this.getState = function(callback){ //err, valuesFromCache
        callback(null,"");
    }

    this.updateState = function(internalValues, callback){
        console.info("Commiting state in memory cache "/*, internalValues*/)
        callback(null,"");
    }
}

module.exports = {
    createCache:function(cacheType,...args){
        switch(cacheType){
            case "fs": return new LocalWSCache(...args);
            case "none":
            case "memory": return new MemoryCache(...args);
            default:
                $$.exception("Unknown blockchain cache "+ cacheType);
        }
    }
}