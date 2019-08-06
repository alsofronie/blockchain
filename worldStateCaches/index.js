


function LocalWSCache(folder){
    const worldStateCachePath = folder+"/worldSateCache";
    var fs = require("fs");

    this.getState = function(callback){ //err, valuesFromCache
        fs.readFile(worldStateCachePath, function(err,res){
            let objRes = {};
            try{
                $$.propagateError(err,callback);
                objRes = JSON.parse(res);
                callback(null, objRes);
            } catch(err){
                console.log("Initialisating blockchain state");
                callback(null, objRes);
            }
        });
    }

    this.updateState = function(internalValues, callback){
        fs.writeFile(worldStateCachePath, JSON.stringify(internalValues, null,1), callback);
    }
}

function MemoryCache(){
    var latestState = {};
    this.getState = function(callback){ //err, valuesFromCache
        callback(null,latestState);
    }

    this.updateState = function(internalValues, callback){
        console.info("Commiting state in memory cache "/*, internalValues*/)
        latestState = internalValues;
        callback(null,latestState);
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