let  cfg = require("./simulationConfig").config;
let dc = require('../../../double-check');
let assert = dc.assert;

const cluster = require('cluster');

if (cluster.isMaster) {
    assert.begin("Starting simulation central node "+ cfg.SIMULATION_TIMEOUT  + " seconds", null, cfg.SIMULATION_TIMEOUT + 1000);
    // Keep track of http requests

    // Count requests
    function messageHandler(msg) {
        console.log("Received message from a child and broadcasting");
        for (const id in cluster.workers) {
            cluster.workers[id].send(msg);
        }
    }

    // Start workers and listen for messages containing notifyRequest
    for(let i = 0; i < cfg.MAX_NODES; i++) {
        cluster.fork();
    }

    for (const id in cluster.workers) {
        cluster.workers[id].on('message', messageHandler);
    }


} else {
    assert.begin("Starting blockchain replica", null, cfg.SIMULATION_TIMEOUT);
    ___DISABLE_OBSOLETE_ZIP_ARCHIVER_WAIT_FOR_BARS = true;
    require("../../../../psknode/bundles/pskruntime.js");
    let bm = require('../../index');
    require('./simulationConstitution');
    const storageFolder = "./__storageFolder";

    function main(err, storageFolder){
        let worldStateCache = bm.createWorldStateCache("fs", storageFolder);
        let historyStorage = bm.createHistoryStorage("fs", storageFolder);
        let consensusAlgorithm = bm.createConsensusAlgorithm("direct");
        let signatureProvider  =  bm.createSignatureProvider("permissive");

        let network  =  bm.createNetworkCommunicationStrategy("ipc");

        network.listen(function(err, msg){
            console.log("In Child received:", msg);
        })

        network.broadcastPulse({pulse:storageFolder});
        bm.createBlockchain(worldStateCache, historyStorage, consensusAlgorithm, signatureProvider, false, false);
    }

    dc.createTestFolder(storageFolder, main);
}


