
$$.asset.describe("ACLScope", {
    public:{
        concern:"string:key",
        db:"json"
    },
    init:function(concern){
        this.concern = concern;
    },
    addResourceParent : function(resourceId, parentId){

    },
    addZoneParent : function(zoneId, parentId){

    },
    grant :function(agentId,  resourceId){

    },
    allow :function(agentId,  resourceId){
        return true;
    }
});