
function DomainInfo(json, updater){
    if(!json) json = {};

    if(!json.references) json.references = {
        parents:{},
        children:{},
        replicas:{},
        secondary:{}
    };

    if(!json.acls) json.acls = {};

    if(!json.agents) json.agents = {admin:"admin"};

    this.setAlias = function(alias){
        json.alias = alias;
        updater(json);
    }

    function addOrThrow(obj, alias, value, msg){
        var existing = obj[alias];
        if(newReference) $$.error(msg);
        obj[alias] = value;
    }

    this.addDomainReference = function(role, alias, domainUID, addresses){
        var newReference = {
            role:role,
            alias:alias,
            uid:domainUID,
            addresses: addresses
        }
        addOrThrow(json.references[role], alias, newReference, "Could not overwrite the domain alias "+ alias);
        updater(json);
    }

    this.updateDomainAddress = function(role, domainAlias, replicationAgent, adress){
        json.references[role][domainAlias][replicationAgent] = adress;
        updater(json);
    }

    this.addCSB = function(alias, domainUID, dseed){
        var newReference = {
            alias:alias,
            dseed:domainUID
        }
        addOrThrow(json.csbs, alias, newReference, "Could not overwrite the CSB alias " + alias);
        updater(json);
    }

    this.updateCSBReference = function(alias, fingerprint,version ){
        var ref         = json.csbs[alias];
        ref.fingerprint = fingerprint;
        ref.version     = version;
        updater(json);
    }

    this.updateCSBBackupAddress = function(alias, adresses){
        var ref         = json.csbs[alias];
        ref.adresses    = adresses;
        updater(json);
    }

    this.addAgent      = function(agentId, publicKeyHash){
        json.agents[agentId] = publicKeyHash;
        updater(json);
    }


}


module.exports.createDomainInfo = function(json, updater){
    return new DomainInfo(json, updater);
}



var contract = $$.blockchain.lookup("contractType", uid);
contract.doSomething();

var contract1 = $$.contract.start("name", "ctor",...);
contract1.doSomething();

$$.blockchain.save(contract, contract1, ...)


$$.blockchain.currentAgent





