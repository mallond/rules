//     http://www.bizrez.com
//     (c) 2004-2014 David Mallon
//     Freely distributed under the MIT license.

/*global describe: false, it: false*/

var assert = require("assert");
var rulesEngine = require('../engine');
var Facts = require('../facts');
var Rules = require('../rules');

// Load Rule Engine Instance with Rules
var rules = new Rules();
rulesEngine.loadRules(rules);

(function () {

    "use strict";

    describe('Synchronous Tests ', function () {

        describe('Simple rule that returns facts.result RETURN_TRUE', function () {

            it('should return RETURN_TRUE', function () {

                var input = {};
                var output = {};
                var facts = new Facts(input, output);
                facts.result = {};
                var ruleId = "RETURN_TRUE";

                var err = null;
                rulesEngine.execute(err, facts, ruleId, function () {
                });

                assert.strictEqual((err instanceof Error), false);
                assert.strictEqual(facts.output.result, "RETURN_TRUE");

            });
        });

        describe('Simple rule that returns facts.result RETURN_FALSE', function () {

            it('should return RETURN_FALSE', function () {

                var input = {};
                var output = {};
                var facts = new Facts(input, output);
                facts.result = {};
                var ruleId = "RETURN_FALSE";

                var err = null;
                rulesEngine.execute(err, facts, ruleId, function () {
                });

                assert.strictEqual((err instanceof Error), false);
                assert.strictEqual(facts.output.result, "RETURN_FALSE");

            });
        });

        describe('Simple rule that returns addition of a+b', function () {

            it('should return RETURN_FALSE', function () {
                var input = {a: 5, b: 6};
                var output = {};
                var facts = new Facts(input, output);
                facts.result = {};
                var ruleId = "SIMPLE_CALC";

                var err = null;
                rulesEngine.execute(err, facts, ruleId, function () {
                });

                assert.strictEqual((err instanceof Error), false);
                assert.strictEqual(facts.output.sum, 11);

            });
        });

        describe('Simple rule that returns hello + and time salutation ', function () {

            it('should return RETURN_FALSE', function () {
                var input = {hour: 10};
                var output = {};
                var facts = new Facts(input, output);
                facts.result = {};
                var ruleId = "GREETING";

                var err = null;
                rulesEngine.execute(err, facts, ruleId, function () {
                });


                assert.strictEqual(facts.output.greeting, "Good Morning");

            });
        });

    });

    describe('Asynchronous Tests ', function (done) {

        describe('Template Async Sanity Check', function () {

            it('should take less than 500ms', function (done) {
                setTimeout(done, 500);
            });

        });

        describe("1000 Interactions ADDR Group A", function () {

            it("Push 1000 ADDR queue entries ", function (done) {

                var output = {};
                var input = {};

                output.sum = 0;
                input.value = 1;

                var facts = new Facts(input, output);

                // List of rules to run
                var list = [
                    {facts: facts, ruleId: 'ADDR', stop: false, callback: null}
                ];

                for (var i = 0; i < 1000; i++) {
                    rulesEngine.queue.push(list, function (err) {
                        // This call back called for each item in this list
                        // Assert on SIMPLE_CALC
                        assert.strictEqual((err instanceof Error), false);
                        if (facts.output.sum === 1000) {
                            assert.strictEqual(facts.output.sum, 1000);
                            done();
                        }

                    });
                }

            });

        });

        describe("1000 Interactions ADDR Group B", function () {

            it("Push 1000 ADDR queue entries ", function (done) {

                var output = {};
                var input = {};

                output.sum = 0;
                input.value = 1;

                var facts = new Facts(input, output);

                // List of rules to run
                var list = [
                    {facts: facts, ruleId: 'ADDR', stop: false, callback: null}
                ];

                for (var i = 0; i < 1000; i++) {
                    rulesEngine.queue.push(list, function (err) {
                        // This call back called for each item in this list
                        // Assert on SIMPLE_CALC
                        assert.strictEqual((err instanceof Error), false);
                        if (facts.output.sum === 1000) {
                            assert.strictEqual(facts.output.sum, 1000);
                            done();
                        }

                    });
                }

            });

        });

        describe('Run a list of rules over Facts', function () {
            it('last rule should === 105', function (done) {

                var output = {};
                var input = {};

                output.sum = 0;
                input.a = 50;
                input.b = 55;

                var facts = new Facts(input, output);

                // List of rules to run
                var list = [
                    {facts: facts, ruleId: 'RETURN_TRUE', stop: false, callback: null},
                    {facts: facts, ruleId: 'RETURN_FALSE', stop: false, callback: null},
                    {facts: facts, ruleId: 'SIMPLE_CALC', stop: false, callback: null}
                ];

                rulesEngine.queue.push(list, function (err) {
                    // This call back called for each item in this list
                    // Assert on SIMPLE_CALC

                    assert.strictEqual((err instanceof Error), false);
                    if (facts.output.sum > 0) {
                        assert.strictEqual(facts.output.sum, 105);
                        done();
                    }

                });
            });
        });
    });

})();








