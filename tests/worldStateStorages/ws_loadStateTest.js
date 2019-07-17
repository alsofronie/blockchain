var m = require("../../index.js");
var assert = require("assert");

const wss = m.createWorldStateStorage("fs", "./example");

wss.load(function(err, result){
   assert(true);
});

