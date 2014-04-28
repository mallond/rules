//     http://www.bizrez.com
//     (c) 2004-2014 David Mallon
//     Freely distributed under the MIT license.

/*global describe: false, it: false, console: false*/

var assert = require("assert");
var rulesEngine = require('../engine');
var Facts = require('../facts');
var Rules = require('../rules');

// Closure so Mocha does not execute - Run manually

var runMe = false;

(function (runMe) {

    "use strict";


    if (runMe) {

        // Load Rule Engine Instance with Rules
        var rules = new Rules();
        rulesEngine.loadRules(rules);

        var input = {hour: 10};
        var output = {};
        var facts = new Facts(input, output);
        facts.result = {};
        var ruleId = "GREETING";
        var err = null;
        var MILLION = 1000000;

        // Start Time
        var startTime = new Date().getTime();

        console.dir(facts);

        for (var i = 0; i < MILLION; i++) {
            // Execute rule
            rulesEngine.execute(err, facts, ruleId, function () {
            });
        }

        // End Time
        var endTime = new Date().getTime();
        console.log((endTime - startTime) + "ms");
        console.log(facts.output.greeting);
        assert.strictEqual(facts.output.greeting, "Good Morning");
    }


})(runMe);

