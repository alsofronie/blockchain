let callflowModule = require("callflow");
let CNST = require("../moduleConstants");

exports.createForObject = function(valueObject, thisObject, localId){
	var ret = callflowModule.createStandardAPIsForSwarms(valueObject, thisObject, localId);
	ret.swarm           = null;
	ret.onReturn        = null;
	ret.onResult        = null;
	ret.asyncReturn     = null;
	//ret.return          = null;
	ret.home            = null;
	ret.autoInit        = function(blockchain){
		thisObject.transaction = blockchain.beginTransaction(thisObject);
	};
	ret.commit = function(){
		$$.blockchain.commit(thisObject.transaction);
	}

	return ret;
};