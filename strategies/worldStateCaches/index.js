

function StorageContainer(){
    this.pskdb = {};
    this.keys = {};
    this.pulse = 0;
    let self = this;
    let latestState = {

    };

    this.readKey = function(key){
        return self.keys[key];
    }

    this.writeKey = function(key, value){
        self.keys[key] = value;
    }
}

function LocalWSCache(folder) {
    let storage = new StorageContainer();

    this.readKey = storage.readKey;
    this.writeKey = storage.writeKey;

    const worldStateCachePath = folder + "/worldSateCache";
    let fs = require("fs");

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
                storage.pulse  = objRes.pulse;
                callback(null, storage.pskdb);
            }
        });
    }

    this.updateState = function (internalValues, callback) {
        storage.pskdb = internalValues;
        fs.writeFile(worldStateCachePath, JSON.stringify(storage, null, 1), callback);
    }

    this.dump = function(){
        console.log("LocalWSCache:", storage);
    }
}

function MemoryCache() {
    let storage = new StorageContainer();

    this.readKey = storage.readKey;
    this.writeKey = storage.writeKey;

    this.getState = function (callback) { //err, valuesFromCache
        callback(null, storage.pskdb);
    };

    this.updateState = function (internalValues, callback) {
        console.info("Commiting state in memory cache "/*, internalValues*/)
        storage.pskdb = internalValues;
        storage.pulse = internalValues.pulse;
        callback(null, storage.pskdb);
    };

    this.dump = function(){
        console.log("MemoryCache:", storage);
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