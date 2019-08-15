const bm = require('../index');
const beesHealer = require("swarmutils").beesHealer;


function AliasIndex(assetType, pdsHandler) {
    this.create = function (alias, uid) {
        const assetAliases = this.getAliases();

        if (typeof assetAliases[alias] !== "undefined") {
            $$.exception(`Alias ${alias} for assets of type ${assetType} already exists`);
        }

        assetAliases[alias] = uid;

        pdsHandler.writeKey(assetType + ALIASES, J(assetAliases));
    };

    this.getUid = function (alias) {
        const assetAliases = this.getAliases();
        return assetAliases[alias];
    };

    this.getAliases = function () {
        let aliases = pdsHandler.readKey(assetType + ALIASES);
        return aliases ? JSON.parse(aliases) : {};
    }
}


const ALIASES = '/aliases';
function createLookup(pdsHandler, SPRegistry){
    function hasAliases(spaceName) {
        var ret  = !!pdsHandler.readKey(spaceName + ALIASES);
        return ret;
    }

    return function (assetType, aid) { // aid == alias or id
        let localUid = aid;
        assetType = $$.fixSwarmName(assetType);

        if (hasAliases(assetType)) {
            const aliasIndex = new AliasIndex(assetType, pdsHandler);
            localUid = aliasIndex.getUid(aid) || aid;
        }

        const value = pdsHandler.readKey(assetType + '/' + localUid);

        if (!value) {
            return $$.asset.start(assetType);
        } else {
            const swarm = $$.asset.continue(assetType, JSON.parse(value));
            swarm.setMetadata("persisted", true);
            return swarm;
        }
    };
}

function Blockchain(pds, algorithm) {
    var SPRegistry = require("../strategies/securityParadigmRegistry/securityParadigmRegistry").getRegistry(this);
    let signatureProvider;

    this.beginTransaction = function (transactionSwarm) {
        if (!transactionSwarm) {
            $$.exception("Can't begin a transaction outside of a swarm instance from transactions namespace");
        }
        return new Transaction(pds.getHandler(), transactionSwarm);
    };

    this.commit = function (transaction, asCommand) {
        var swarm = transaction.getSwarm();
        var handler =  transaction.getHandler();
        const diff = pds.computeSwarmTransactionDiff(swarm,handler);

        const  t = bm.createCRTransaction(swarm.getMetadata("swarmTypeName"), asCommand, diff.input, diff.output, algorithm.getCurrentPulse());
        algorithm.commit(pds, t);
    };

    this.start = function(reportBootingFinishedCallback){
        pds.initialise(reportBootingFinishedCallback);
    };


    this.lookup = createLookup(pds.getHandler(), SPRegistry);

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
}

function Transaction(pdsHandler, transactionSwarm) {


    this.getSwarm = function(){
        return transactionSwarm;
    };

    this.getHandler = function () {
        return pdsHandler;
    };

    this.add = function (asset) {
        const swarmTypeName = asset.getMetadata('swarmTypeName');
        const swarmId = asset.getMetadata('swarmId');

        const aliasIndex = new AliasIndex(swarmTypeName, pdsHandler);
        if (asset.alias && aliasIndex.getUid(asset.alias) !== swarmId) {
            aliasIndex.create(asset.alias, swarmId);
        }

        asset.setMetadata('persisted', true);
        const serializedSwarm = beesHealer.asJSON(asset, null, null);

        pdsHandler.writeKey(swarmTypeName + '/' + swarmId, J(serializedSwarm));
    };

    this.lookup = createLookup(pdsHandler);

    this.loadAssets = function (assetType) {
        assetType = $$.fixSwarmName(assetType);
        const assets = [];

        const aliasIndex = new AliasIndex(assetType, pdsHandler);
        Object.keys(aliasIndex.getAliases()).forEach(alias => {
            assets.push(this.lookup(assetType, alias));
        });

        return assets;
    };
}

module.exports = Blockchain;