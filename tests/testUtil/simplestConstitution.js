

$$.asset.describe("Agent", {
    public:{
        alias:"string:key",
        publicKey:"string"
    },
    init:function(alias, value){
        this.alias      = alias;
        this.publicKey  = value;
    },
    ctor:function(){
        this.securityParadigm.constitutional();
    }
});


$$.transaction.describe("Constitution", {
    addAgent: function (alias, publicKey) {
        var agent = $$.asset.start("Agent", "init", alias, publicKey);
        console.log("addAgent:", agent.alias,  agent.publicKey);
        this.transaction.add(agent);
        this.commit();
    },
    updatePublicKey: function (alias, publicKey) {
        var agent = $$.blockchain.lookup("Agent", alias);
        agent.publicKey = publicKey;
        this.transaction.add(agent);
        this.transaction.commit();
    }
})