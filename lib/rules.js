//     http://www.bizrez.com
//     (c) 2004-2014 David Mallon
//     Freely distributed under the MIT license.

/*global module: false */

var _ = require("underscore");

// Closure Object creation
var Rules = (function () {

    "use strict";

    function Rules() {

        Rules.prototype.rules = [
            {
                "id": "RETURN_TRUE",
                "description": "Simply always returns rule_id",
                "condition": function (facts) {
                    return true;
                },
                "action": function (facts) {
                    //Take Action on this facts object
                    facts.output.result = this.id;
                }
            },
            {
                "id": "RETURN_FALSE",
                "desscription": "Simply always returns rule_id",
                "condition": function (facts) {
                    facts.output.result = this.id;
                    return false;
                },
                "action": function (facts) {
                    // Never happens
                }
            },
            {
                "id": "SIMPLE_CALC",
                "description": "Simple addition calculator of two numbers",
                "condition": function (facts) {
                    // We will calculate the results regardless
                    return true;
                },
                "action": function (facts) {
                    facts.output.sum = facts.input.a + facts.input.b;
                }
            },
            {
                "id": "ADDR",
                "description": "Simple Adder calculator",
                "condition": function (facts) {
                    // We will calculate the results regardless
                    return true;
                },
                "action": function (facts) {
                    facts.output.sum = facts.input.value + facts.output.sum;
                }
            },
            {
                "id": "GREETING",
                "description": "Show correct greeting based on time",
                "condition": function (facts) {
                    // We will calculate the results regardless
                    return true;
                },
                "action": function (facts) {

                    var decisionTable
                        = [
                        {from: 0, to: 11, greeting: 'Good Morning'},
                        {from: 12, to: 17, greeting: 'Good Afternoon'},
                        {from: 18, to: 22, greetings: 'Good Evening'},
                        {from: 23, to: 24, greetings: 'Good Night'}
                    ];

                    var resultArray;

                    // MAP
                    resultArray = _.map(decisionTable, function (row) {
                        var result = "";
                        if (facts.input.hour >= row.from && facts.input.hour <= row.to) {
                            result = row.greeting;
                        }
                        return result;
                    });
                    // Reduce
                    var result = _.reduce(resultArray, function (memory, element) {
                        if (element !== "") {
                            memory = element;
                        }
                        return  memory;
                    });
                    facts.output.greeting = result;

                }
            }
        ];

    }

    return Rules;

})();

module.exports = Rules;





