
function SecurityParadigm(){

}

function ConstitutionalSPFactory(){

}

function PredicativeSPFactory(){

}

function RestrictedSPFactory(){

}

function Registry(blockchain){
    let all = {};
    let apiNames = {};
    let self = this;
    this.register = function (SPName, apiName, factory) {
        all[SPName]         = factory;
        apiNames[SPName]    = apiName;
    }

    this.getSecurityParadigm = function(assetInstance){
        let ret = new SecurityParadigm();
        for(let v in apiNames){
            ret[v] = apiNames[v];
        }
    }

    this.initDefaultParadigms = function(){
        self.register("constitutional","constitutional", new ConstitutionalSPFactory());
        self.register("restricted","allow", new RestrictedSPFactory());
        self.register("predicative","addPredicate", new PredicativeSPFactory());
    }
}

module.exports = {
    getRegistry: function () {
        return new Registry();
    }
}