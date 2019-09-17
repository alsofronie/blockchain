

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
        console.log("Adding Agent:", alias,  publicKey);
        let agent = $$.asset.start("Agent", "init", alias, publicKey);
        this.transaction.add(agent);
        this.commit();
    },
    updatePublicKey: function (alias, publicKey) {
        let agent = $$.blockchain.lookup("Agent", alias);
        if(agent){
            agent.publicKey = publicKey;
            this.transaction.add(agent);
            this.transaction.commit();
            console.log("Updating Agent:", alias,  "PublicKey:", publicKey);
        }
    }
})