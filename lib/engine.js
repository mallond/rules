//     http://www.bizrez.com
//     (c) 2004-2014 David Mallon
//     Freely distributed under the MIT license.

/*global module: false,  onevar: false, console: false */

var async = require("async");

// Main: engine.execute Stateless
(function () {

    "use strict";

    var STATUS_CONDITION_MET = "Condition-Met";
    var STATUS_CONDITION_NOT_MET = "Condition-Not-Met";
    var CONCURENCY = 2;

    var engine = {};
    var rules = [];
    var rulesIndex = [];

    engine.loadRules = function (rulesToLoad) {
        rules = rulesToLoad.rules;
        // Create index by rule-id for lookup
        for (var i = 0; i < rules.length; i++) {
            rulesIndex.push(rules[i].id);
        }
    };

    // Run list of rules placed in the queue
    engine.queue = async.queue(function (list, callback) {

        var err = null;

        engine.execute(err, list.facts, list.ruleId, function () {


            // Rule run on Facts completed. Do we want to run a callback from the list?
            if (typeof list.callback === "function") {
                list.callback();
            }

        });

        // See rulesEngine.queue.push(list, fn(err)) fn=callback
        callback(err);

    }, CONCURENCY);

    // Main - Run Single Rule
    engine.execute = function (err, facts, ruleId, callback) {

        var ruleIndex;

        // Process The Rule by ruleId
        try {
            // Look up rule
            ruleIndex = rulesIndex.indexOf(ruleId);
            // When the Condition is 'met' then do the 'action'
            if (rules[ruleIndex].condition(facts)) {
                rules[ruleIndex].action(facts);
                facts.output.status = STATUS_CONDITION_MET;
            } else {
                facts.output.status = STATUS_CONDITION_NOT_MET;
            }

        } catch (e) {
            err = new Error("Error on engine.js");
            err.original= e;
            return;
        }

        if (typeof callback === "function") {
            callback();
        }

    };

    module.exports = engine;

})();






