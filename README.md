# blockchain
PrivateSky's embedable blockchain database. 
Blockchain module is used for blockchains (blockchain domains) and for near-chains storage (CSBs as EDFS folders)

Usage of the module:
```$xslt
var blockchain = require("blockchain");

//usually is just a big JSON file but it can be optimised further to act as a local cache, etc
var worldStateStorage   =  blockchain.createWorldStateStorage("fs");

/*history storage is a text file containing blocks 
Each block is containing  multiple CommandOrResult objects serialised on a signle line  each
new line (\n) is used to separate CommandOrResult 
the BLOCK HASH line is used to separate blocks and to act as a checking point during world state reconstruction 
*/
var historyStorage      =  blockchain.createHistoryStorage("fs");

blockchain.init(worldStateCache, historyStorage);

//$$.blockchain is available to create new transactions, etc;
historyStorage.update(); // load new changes and update worldState


```
