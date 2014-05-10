## BizRez Rules - JavaScript Condition Event  Engine

A small functional Rule Engine - simple maybe an understatement...

<img src="http://upload.wikimedia.org/wikipedia/commons/d/dc/Magneto,_longitudinal_section_(Rankin_Kennedy,_Modern_Engines,_Vol_II).jpg" align="right" width="200px" />

## Intro

Simplicity is elegance. This rule engine is NOT forward chaining, backward chaining, nor is this an inference engine. What it is, is a pragmatic reactive engine. Simply stated, when there is a condition, execute an action -- most assuredly in a stateless manner. 

Prime directives, and ables ...
- Stateless
- Simple input, output, and process
- Asynchronous non-blocking invocations
- Rules to be self contained and serializable to a database (persistable)
- Rules to be versioned (versionable)
- Rules to be inventoried and stored in a library (sharable)
- Rules can be modified on-the-fly (adaptable)
- Rules can be unit tested independently (testable)
- Crazy fast

#####[Martin Fowler on Rule Engines](http://martinfowler.com/bliki/RulesEngine.html)


```
// Rule Abilities 
{ables: [persistable, versionable, shareable, adaptable, testable, chainable, reusable, extensible]}
```
## Dependencies

-  Underscore.js for Mapreduce Decision Tables
-  Async.js for asynchronous hooks and behavior 
-  Mocha.js for for test infecting the code (good infection)
-  Require.js for the module loader

## A few Use Cases for Usage

- Validations
- Mappings
- Calculations
- Batch processing
- Automated business rules - decision engine
- Automation of sequential events and process
- Home security, sprinkler systems, and darn maybe your car...

## Benefits

- Repository of rules
- Traceability
- Modify the rule not the code
- Dynamic changeability - conditions change so do the execution
- Easy to understand and modify
- Extensible
- Maintainable
- Reusable
- Chainable  
- Micro foot print and scalable

## Design - IPO (Input Process Output)


<img src="https://lh6.googleusercontent.com/-_xFQNsVja9s/U1XsZBOVi0I/AAAAAAAAG1I/a4Le6ruZDqU/w674-h502-no/rulesEngine.png" style="position:absolute; right:0px;" width="300px" />


```
// Input - Example Greetings

facts = {
          input: { hour: 10 },
          output: {greeting:''}
         }

// Process - Example Decision Table
rule =  {

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
// Output - Example result

facts = {
          input: { hour: 10 },
          output: {greeting:'Good Morning'}
         }

```


## Download

The source is available for download from
[GitHub](http://github.com/mallond/bizrules).

Alternatively, you can install using Node Package Manager [npm](https://www.npmjs.org/package/bizrules):

    npm install bizrules

    mocha test




