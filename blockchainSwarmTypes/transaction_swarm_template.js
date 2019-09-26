let callflowModule = require("callflow");
let CNST = require("../moduleConstants");

exports.createForObject = function(valueObject, thisObject, localId){
	let _blockchain = undefined;

	let ret = callflowModule.createStandardAPIsForSwarms(valueObject, thisObject, localId);
	ret.swarm           = null;
	ret.onReturn        = null;
	ret.onResult        = null;
	ret.asyncReturn     = null;
	//ret.return          = null;
	ret.home            = null;
	ret.autoInit        = function(blockchain){
		_blockchain = blockchain;
		thisObject.transaction = blockchain.beginTransaction(thisObject);
	};
	ret.commit = function(){
		_blockchain.commit(thisObject.transaction);
	}
	return ret;
};