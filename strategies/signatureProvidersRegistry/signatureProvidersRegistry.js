function PermissiveSignatureProvider(){
    /*
    return a signature of message ms for agent agentId
     */
    this.signAs = function(agentId, msg){
        return "signature:"+agentId;
    }

    this.verify = function(msg, signatures){
        return true;
    };
}


module.exports = {
    createSignatureProvider: function (signProvType,...args) {
        switch (signProvType) {
            case "permissive":
                return new PermissiveSignatureProvider(...args);
            case "blockchain":
            default:
                $$.exception("Signature Provider" + signProvType + " not implemented");
        }
    }
}
