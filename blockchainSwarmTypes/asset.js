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
	ret.isPersisted  	= function () {
		return thisObject.getMetadata('persisted') === true;
	};

	ret.autoInit        = function(){
		let sp = thisObject.getMetadata(CNST.SECURITY_PARADIGM);
		thisObject.securityParadigm = $$.blockchain.getSPRegistry().getSecurityParadigm(thisObject);
		if(sp == undefined){
			var ctor = valueObject.myFunctions[CNST.CTOR];
			if(ctor){
				ctor.apply(thisObject);
			}
		}
	};
	return ret;
};