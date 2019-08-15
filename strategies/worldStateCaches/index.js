

function StorageContainer(){
    this.pskdb = {};
    this.keys = {};
    var self = this;
    var latestState = {

    };

    this.readKey = function(key){
        return self.keys[key];
    }

    this.writeKey = function(key, value){
        self.keys[key] = value;
    }
}

function LocalWSCache(folder) {
    var storage = new StorageContainer();

    this.readKey = storage.readKey;
    this.writeKey = storage.writeKey;

    const worldStateCachePath = folder + "/worldSateCache";
    var fs = require("fs");

    this.getState = function (callback) {
        fs.readFile(worldStateCachePath, function (err, res) {
            let objRes = {};
            if (err) {
                callback(err, objRes);
                console.log("Initialisating empty blockchain state");
            } else {
                objRes = JSON.parse(res);
                storage.pskdb = objRes.pskdb;
                storage.keys  = objRes.keys;
                callback(null, storage.pskdb);
            }
        });
    }

    this.updateState = function (internalValues, callback) {
        storage.pskdb = internalValues;
        fs.writeFile(worldStateCachePath, JSON.stringify(storage, null, 1), callback);
    }
}

function MemoryCache() {
    var storage = new StorageContainer();

    this.readKey = storage.readKey;
    this.writeKey = storage.writeKey;

    this.getState = function (callback) { //err, valuesFromCache
        callback(null, storage.pskdb);
    }

    this.updateState = function (internalValues, callback) {
        console.info("Commiting state in memory cache "/*, internalValues*/)
        storage.pskdb = internalValues;
        callback(null, storage.pskdb);
    }
}

module.exports = {
    createCache: function (cacheType, ...args) {
        switch (cacheType) {
            case "fs":
                return new LocalWSCache(...args);
            case "none":
            case "memory":
                return new MemoryCache(...args);
            default:
                $$.exception("Unknown blockchain cache " + cacheType);
        }
    }
}