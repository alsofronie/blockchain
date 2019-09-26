
function LatestHashTracker(){
    let hlb = "none";
    let maxBlockNumber = 0;
    this.update = function(blockNumber,block){
        if(blockNumber > maxBlockNumber){
            hlb = block.blockDigest;
        }
    }
    this.getHashLatestBlock = function(){
        return hlb;
    }
}

function FsHistoryStorage(folder) {
    const blocksPath = folder + "/blocks";
    let lht = new LatestHashTracker();
    this.getHashLatestBlock = lht.getHashLatestBlock;

    let fs = require("fs");

    fs.mkdir(blocksPath, function (err) {
    });

    this.appendBlock = function (block, announceFlag, callback) {
        console.log("Writing block:", block.pulse);
        fs.writeFile(blocksPath + "/index", block.pulse.toString(), $$.logError);
        fs.writeFile(blocksPath + "/" + block.pulse, JSON.stringify(block, null, 1), callback);
        lht.update(block.pulse,block);
    }

    this.getLatestBlockNumber = function (callback) {
        fs.readFile(blocksPath + "/index", function (err, res) {
            let maxBlockNumber = 0;
            if(err){
                callback(err);
            }else{
                maxBlockNumber = parseInt(res);
                callback(null, maxBlockNumber);
            }
        });
    }

    this.loadSpecificBlock = function (blockNumber, callback) {
        fs.readFile(blocksPath + "/" + blockNumber, function (err, res) {
            if (err) {
                callback(err, null);
            } else {
                callback(null, JSON.parse(res));
                lht.update(res.pulse,res);
            }
        });
    }

    ////////////////////////
    let observer;
    //send to callback all blocks newer then fromVSD
    this.observeNewBlocks = function (fromVSD, callback) {
        observer = callback;
    }
}


function MemoryStorage() {
    let blocks = [];
    let lht = new LatestHashTracker();
    this.getHashLatestBlock = lht.getHashLatestBlock;

    this.appendBlock = function (block, announceFlag, callback) {
        blocks.push(block);
        lht.update(blocks.length,block);
        callback(null, block);

    }

    this.getLatestBlockNumber = function (callback) {
        callback(null, blocks.length);
    }

    this.loadSpecificBlock = function (blockNumber, callback) {
        let block =  blocks[blockNumber];
        lht.update(blockNumber,block);
        callback(null, blocks[blockNumber]);
    }
}

module.exports = {
    createStorage: function (storageType, ...args) {
        switch (storageType) {
            case "fs":
                return new FsHistoryStorage(...args);
            case "memory":
                return new MemoryStorage(...args);
            default:
                $$.exception("Unknown blockchain storage " + storageType);
        }
    }
}