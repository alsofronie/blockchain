

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
        var reference = $$.asset.start("Agent", "init", alias, publicKey);
        this.transaction.add(reference);
        //$$.blockchain.commit(this.transaction);
        this.commit();
    }
})