const bm = require('../index');
const beesHealer = require("swarmutils").beesHealer;
var CNST = require("../moduleConstants");

function AliasIndex(assetType, pdsHandler, worldStateCache) {
    this.create = function (alias, uid) {
        const assetAliases = this.getAliases();

        if (typeof assetAliases[alias] !== "undefined") {
            $$.exception(`Alias ${alias} for assets of type ${assetType} already exists`);
        }

        assetAliases[alias] = uid;

        worldStateCache.writeKey(assetType + CNST.ALIASES, J(assetAliases));
    };

    this.getUid = function (alias) {
        const assetAliases = this.getAliases();
        //console.log("assetAliases", assetAliases);
        return assetAliases[alias];
    };

    this.getAliases = function () {
        let aliases = worldStateCache.readKey(assetType + CNST.ALIASES);
        return aliases ? JSON.parse(aliases) : {};
    }
}



function createLookup(pdsHandler, SPRegistry, worldStateCache){
    function hasAliases(spaceName) {
        var ret  = !!worldStateCache.readKey(spaceName + CNST.ALIASES);
        return ret;
    }

    return function (assetType, aid) { // aid == alias or id

        let localUid = aid;
        assetType = $$.fixSwarmName(assetType);

        if (hasAliases(assetType)) {
            const aliasIndex = new AliasIndex(assetType, pdsHandler, worldStateCache);
            localUid = aliasIndex.getUid(aid) || aid;
        }

        const value = pdsHandler.readKey(assetType + '/' + localUid);

        if (!value) {
            $$.log("Lookup fail, asset not found: ",assetType, " with alias", aid);
            //return $$.asset.start(assetType);
            return null;
        } else {
            const swarm = $$.asset.continue(assetType, JSON.parse(value));
            return swarm;
        }
    };
}

function Blockchain(pskdb, consensusAlgorithm, worldStateCache) {
    var SPRegistry = require("../strategies/securityParadigmRegistry/securityParadigmRegistry").getRegistry(this);
    let signatureProvider;

    this.beginTransaction = function (transactionSwarm) {
        if (!transactionSwarm) {
            $$.exception("Can't begin a transaction outside of a swarm instance from transactions namespace");
        }
        return new Transaction(pskdb.getHandler(), transactionSwarm, worldStateCache, SPRegistry);
    };


    this.start = function(reportBootingFinishedCallback){
        pskdb.initialise(reportBootingFinishedCallback);
    };


    this.lookup = createLookup(pskdb.getHandler(), SPRegistry, worldStateCache);
    /*
    this.lookup = function(typeName, alias){
        var lf = createLookup(pskdb.getHandler(), SPRegistry, worldStateCache);
        return lf(typeName, alias);
    }*/

    this.getSPRegistry = function(){
        return SPRegistry;
    }

    this.signAs = function(agentId, msg){
        return signatureProviderInstance.sign(agentId, msg);
    };

    this.verifySignature = function(msg, signatures){
        return signatureProvider.verify(msg, signatures);
    };

    this.registerSignatureProvider = function(signatureProviderInstance){
        signatureProvider = signatureProviderInstance;
    };

    this.registerSecurityParadigm = function(SPName, apiName, factory){
        return SPRegistry.register(SPName, apiName, factory);
    }


    this.startCommandAs = function(agentId, transactionSwarmType,...args){
        let t = bm.createCRTransaction(transactionSwarmType, args, null, null, consensusAlgorithm.getCurrentPulse());
        t.signatures = [this.signAs(agentId, t.digest)];
        consensusAlgorithm.commit(t);
    }

    this.startTransactionAs = function(agentId, transactionSwarmType,...args){
        let swarm = $$.transaction.start(transactionSwarmType,...args);
        swarm.setMetadata(CNST.COMMAND_ARGS, args);
    }

    this.commit = function (transaction) {
        let swarm = transaction.getSwarm();
        let handler =  transaction.getHandler();
        const diff = handler.computeSwarmTransactionDiff(swarm);
        console.log("Diff is", diff.output);
        const  t = bm.createCRTransaction(swarm.getMetadata("swarmTypeName"), swarm.getMetadata(CNST.COMMAND_ARGS), diff.input, diff.output, consensusAlgorithm.getCurrentPulse());
        t.signatures = [this.signAs(agentId, t.digest)];
        consensusAlgorithm.commit(t);
    };
}

function Transaction(pdsHandler, transactionSwarm, worldStateCache, SPRegistry) {

    let self = this;

    this.getSwarm = function(){
        return transactionSwarm;
    };

    this.getHandler = function () {
        return pdsHandler;
    };

    this.add = function (asset) {
        console.log("Adding asset", asset.publicKey);
        const swarmTypeName = asset.getMetadata('swarmTypeName');
        const swarmId = asset.getMetadata('swarmId');

        const aliasIndex = new AliasIndex(swarmTypeName, pdsHandler, worldStateCache);
        if (asset.alias && aliasIndex.getUid(asset.alias) !== swarmId) {
            aliasIndex.create(asset.alias, swarmId);
        }


        const serializedSwarm = beesHealer.asJSON(asset, null, null);

        pdsHandler.writeKey(swarmTypeName + '/' + swarmId, J(serializedSwarm));
    };

    this.lookup = createLookup(pdsHandler, SPRegistry, worldStateCache);

    this.loadAssets = function (assetType) {
        assetType = $$.fixSwarmName(assetType);
        const assets = [];

        const aliasIndex = new AliasIndex(assetType, pdsHandler, worldStateCache);
        Object.keys(aliasIndex.getAliases()).forEach(alias => {
            assets.push(self.lookup(assetType, alias));
        });

        return assets;
    };

    this.commit = function(){
        $$.blockchain.commit(self);
    };
}

module.exports = Blockchain;