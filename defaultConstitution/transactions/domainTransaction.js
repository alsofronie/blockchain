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
        const transaction = $$.blockchain.beginTransaction({});
        const domain = transaction.lookup('global.DomainReference', alias);

        if (!domain) {
            this.return(new Error('Could not find swarm named "global.DomainReference"'));
            return;
        }

        this.return(null, domain.toJSON());
    },
    connectDomainToRemote(domainName, alias, remoteEndPoint){
        const transaction = $$.blockchain.beginTransaction({});
        const domain = transaction.lookup('global.DomainReference', domainName);

        if (!domain) {
            this.return(new Error('Could not find swarm named "global.DomainReference"'));
            return;
        }

        domain.addRemoteInterface(alias, remoteEndPoint);

        try{
            transaction.add(domain);

            $$.blockchain.commit(transaction);
        }catch(err){
            console.log(err);
            this.return(new Error("Domain update failed!"));
            return;
        }

        this.return(null, alias);
    },
    getDomainDetails: sharedPhases.getAssetFactory('global.DomainReference'),
    getDomains: sharedPhases.getAllAssetsFactory('global.DomainReference')
});
