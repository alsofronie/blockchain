var callflowModule = require("callflow");
var CNST = require("../moduleConstants");

exports.createForObject = function(valueObject, thisObject, localId){
	var ret = callflowModule.createStandardAPIsForSwarms(valueObject, thisObject, localId);

	ret.swarm           = null;
	ret.onReturn        = null;
	ret.onResult        = null;
	ret.asyncReturn     = null;
	ret.return          = null;
	ret.home            = null;

	ret.autoInit        = function(blockchain){
		if(!blockchain) return;
		let sp = thisObject.getMetadata(CNST.SECURITY_PARADIGM);
		thisObject.securityParadigm = blockchain.getSPRegistry().getSecurityParadigm(thisObject);
		if(sp == undefined){
			let ctor = valueObject.myFunctions[CNST.CTOR];
			if(ctor){
				ctor.apply(thisObject);
			}
		}
	};

	ret.getSwarmId = function(){
		return 	thisObject.getMetadata(CNST.SWARMID);
	}

	ret.getSwarmType = function(){
		return 	thisObject.getMetadata(CNST.SWARMTYPE);
	}

	ret.__reinit = function(blockchain){
		ret.autoInit(blockchain);
	}
	return ret;
};