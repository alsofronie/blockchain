const sharedPhases = require('./sharedPhases');

$$.transaction.describe("Domain", {
    add: function (alias, role, workspace, constitution, localInterface) {
        let domain = $$.blockchain.lookup("DomainReference", alias);
        if(!domain){
            domain = $$.asset.start("DomainReference", "init", role, alias);
        }else{
            $$.exception(`Domain with ${alias} already exists!`);
        }

        if(typeof workspace !== "undefined"){
            domain.setWorkspace(workspace);
        }

        if(typeof constitution !== "undefined"){
            domain.setConstitution(constitution);
        }

        if(typeof localInterface !== "undefined"){
            domain.addLocalInterface('local', localInterface);
        }

        this.transaction.add(domain);
        this.commit();
    },
    connectDomainLocally: function(alias, localInterface){
        let domain = $$.blockchain.lookup("DomainReference", alias);
        domain.addLocalInterface('local', localInterface);

        this.transaction.add(domain);
        this.commit();
    },
    setWorkspaceForDomain: function(alias, workspace){
        let domain = $$.blockchain.lookup("DomainReference", alias);
        domain.setWorkspace(workspace);

        this.transaction.add(domain);
        this.commit();
    },
    setConstitutionForDomain: function(alias, constitution){
        let domain = $$.blockchain.lookup("DomainReference", alias);
        domain.setConstitution(constitution);

        this.transaction.add(domain);
        this.commit();
    },
    getDomainDetails:function(alias){
        let domain = $$.blockchain.lookup("DomainReference", alias);
        return domain.toJson();
    },
    connectDomainToRemote(domainName, alias, remoteEndPoint){
        let domain = $$.blockchain.lookup("DomainReference", domainName);
        domain.addRemoteInterface(alias, remoteEndPoint);

        this.transaction.add(domain);
        this.commit();
    },
    getDomainDetails: sharedPhases.getAssetFactory('global.DomainReference'),
    getDomains: sharedPhases.getAllAssetsFactory('global.DomainReference')
});
