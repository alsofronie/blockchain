

exports.getRandomInt = function getRandomInt(max) {
    if(!max){
        console.log("getRandomInt with undefined argument. Defaulting to 1000", new Error());
        max = 1000;
    }
    let n = Math.floor(Math.random() * max);
    return n;
}


exports.config = {
    MAX_NODES          : 3,
    SIMULATION_TIMEOUT : 3000,
    PULSE_PERIODICITY  : 100,
    MAX_KEYS_COUNT     : 100,
    MAX_TRANSACTIONS   : 100,
    MAX_TRANSACTION_TIME: 200,
    NETWORK_DELAY      : 100
};


GLOBAL_MAX_TRANSACTION_TIME = exports.config.MAX_TRANSACTION_TIME / 1000;
