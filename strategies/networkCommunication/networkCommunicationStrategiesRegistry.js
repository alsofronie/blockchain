const mc = require("../../moduleConstants");
let pulseUtil = require("../../OBFT/PulseUtil");


function IPCNetworkSimulator(){
    this.broadcastPulse = function(pulse){
        process.send(pulse);
    }

    this.newPulse = function(){
        let p = pulseUtil.createPulse()
        process.send(pulse);
    }

    this.listen = function(callback){
        process.on('message', function(msg){
            callback(null, msg);
        })
    }
}

/*
var com = {
    broadcastPulse: function(from, pulse){
        nodes.forEach( function(n){
            if(n.nodeName != from) {
                setTimeout(function(){
                    n.recordPulse(from, pulse);
                }, cutil.getRandomInt(cfg.NETWORK_DELAY));
            } else {
                if(pulse.currentPulse > 2 * maxPulse){
                    afterFinish[from] = true;
                }
            }
        });


        if(Object.keys(afterFinish).length >= cfg.MAX_NODES){
            console.log(Object.keys(afterFinish).length , cfg.MAX_NODES);
            setTimeout(terminate, 1);
        }
    }
} */



function VirtualMQAdapter(){

}

module.exports = {
    createNetworkAdapter: function (strategyType, ...args) {
        switch (strategyType) {
            case "ipc":
                return new IPCNetworkSimulator(...args);
            case "virtualmq":
                return new VirtualMQAdapter(...args);
            default:
                $$.error("Unknown communication strategy  " + strategyType);
        }
    }
}