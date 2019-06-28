module.exports = {
    createBlockchain:function(storageTypeAsString, params){   // memory, folder, edfs
        var storage;

        switch(storageTypeAsString){
            case "memory": storage = require("storages/MemoryStorage", params); break;
            case "folder": storage = require("storages/FolderStorage", params); break;
            case "edfs": storage = require("storages/EDFSStorage", params); break;
            default: throw new Error("unknown storage");
        }
        return require("./pskdb").startDB(storage);
    },
    createMemoryPSKDB:function(){

    }
}