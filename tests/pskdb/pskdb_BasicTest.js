var m = require("../../index.js");

var fs= require("fs");


const TEMP_FOLDER = "./temp";

 tu.deleteFolderRecursive(TEMP_FOLDER);

fs.mkdirSync(TEMP_FOLDER);
var assert = require("assert");

const hs = m.createHistoryStorage("fs", TEMP_FOLDER);
const wss = m.createWorldStateStorage("fs", TEMP_FOLDER);

m.init(wss,hs);
assert($$.blockchain != null);
