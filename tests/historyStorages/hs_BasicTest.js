var m = require("../../index.js");
var assert = require("assert");

const hs = m.createHistoryStorage("fs", "./temp");

hs.clean(function(err, result){
    hs.addThing({test:"test1"});
    hs.addThing({test:"test2"});
    hs.endBlock("HASH1")

    hs.addThing({test:"test3"});
    hs.addThing({test:"test4"});
    hs.addThing({test:"test5"});
    hs.endBlock("HASH2")

    hs.save(function(err,res){
        let hsTest = m.createHistoryStorage("fs", "./temp");
        var counter = 0;
        hsTest.enumerateBlocks(function(block){
            if(block){
                counter++;
                if(counter == 1){
                    assert(block.length == 2);
                    assert(block.hash === "HASH1");
                } else if(counter == 2){
                    assert(block.length == 3);
                    assert(block.hash === "HASH2");
                    assert(block.things[3].test === "test5");
                } else {
                    assert(false);
                }
            }
        })
    });
});

