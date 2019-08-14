

function ConstitutionalSPFactory(){
     this.constitutional = function(spm, optionalTransactionName){
         spm.addSecurityParadigm("constitutional",optionalTransactionName);
     }

    /* we do not instantiate SPs... but anyway it behaves as some sort of factory in an virtual way of instantiation*/
    this.checkInsideTransactionValidation = function(transaction, asset){

    }
}

function PredicativeSPFactory(){
    let predicates = {};
    this.predicate = function(spm, predicateName, predicateDefinition){
        predicates[predicateName] = predicateDefinition;
        spm.addSecurityParadigm("predicative",predicateName);
    }
    /* not allowed for now... maybe in future*/
    this.registerPredicate = function(predicateName, predicateFunction){

    }

    /* */
    this.checkInsideTransactionValidation = function(transaction, asset){

    }
}

function RestrictedSPFactory(){
    this.allow = function(spm, agentId){
        spm.addSecurityParadigm("restricted",agentId);
    }

    this.checkInsideTransactionValidation = function(transaction, asset){

    }

}


function mkApi(sp, APIName, factory){
    return function(...args){
        return factory[APIName](sp, ...args);
    }
}

function SecurityParadigmMetadata(assetInstance, apiNames, allFactories){
    let innerValues = assetInstance.getMetadata("securityParadigm");

    for(let v in apiNames){
        this[apiNames[v]] = mkApi(this, apiNames[v], allFactories[v]);
    }
    this.addSecurityParadigm = function(name, value){
        if(typeof innerValues[name] == "undefined"){
            innerValues[name] = value;
        }
        if(typeof innerValues[name] == "string"){
            let prevValue = innerValues[name];
            innerValues[name] =[prevValue,value];
        } else{
            innerValues[name].push(name);
        }
    }

    this.removeSecurityParadigm = function(name, value){
        if(typeof innerValues[name] == "string"){
            let prevValue = innerValues[name];
            innerValues[name] =[prevValue,value];
        } else{
            let index = innerValues[name].indexOf(value);
            if (index !== -1) innerValues[name].splice(index, 1);
        }
    }
}


function Registry(blockchain){
    let allFactories = {};
    let apiNames = {};
    let self = this;
    this.register = function (SPName, apiName, factory) {
        all[SPName]         = factory;
        apiNames[SPName]    = apiName;
    }

    this.getSecurityParadigm = function(assetInstance){
        return new SecurityParadigmMetadata(assetInstance, apiNames, allFactories);
    }

    this.initDefaultParadigms = function(){
        self.register("constitutional","constitutional", new ConstitutionalSPFactory());
        self.register("restricted","allow", new RestrictedSPFactory());
        self.register("predicative","addPredicate", new PredicativeSPFactory());
    }

    this.validateTransaction = function(currentLayer, transaction){

    }
}

module.exports = {
    getRegistry: function () {
        return new Registry();
    }
}