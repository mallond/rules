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
// Input - Example Greetings (rules.js - not functional but a conceptual demo)

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
## Validation Rules

Setup Example
```
// Set Up Validate Functions to be used by the validation engine
const _validate = new validate();
const _isDecimal3 = _validate.isDecimal(3);
const _isDecimal4 = _validate.isDecimal(4);
const _isDecimal5 = _validate.isDecimal(5);
const _range5_10 = _validate.range(5, 10);
const _phoneType = _validate.inGroup(['home', 'business']);
const _membership = _validate.inGroup(['Gold', 'Silver', 'Bronze']);

// Setup Phone validation rules
const validationRulesPersonPhones = [
    {key: 'type',   validate: _.isString, error: 'phone.type is not a valid string type'},
    {key: 'type',   validate: _phoneType, error: 'phone.type is not in phone type group'},
    {key: 'number', validate: _.isString, error: 'phone.number invalid'}
];

// Setup Person validation rules
const validationRulesPerson = [

    {key: 'person.firstName', validate: _.isString,  error: 'person.firstName not a string'},
    {key: 'person.lastName',  validate: _.isString , error: 'person.lastName not a string'},
    {key: 'person.DOB',       validate: _.isDate,    error: 'person.DOB invalid'},
    {key: 'person.secret.id', validate: _.isString,   error: 'person.secret.id not a string'},
    {key: 'person.secret.pwd',validate: _.isString,   error: 'person.secret.pwd not a string'},
    {key: 'person.email',     validate: _validate.isEmail,      error: 'person.email is invalid'},
    {key: 'id',               validate: _.isNumber,  error: 'id is not a number'},
    {key: 'dec3',             validate: _isDecimal3, error: 'dec3 is not three decimals'},
    {key: 'dec4',             validate: _isDecimal4, error: 'dec4 is not three decimals'},
    {key: 'dec5',             validate: _isDecimal5, error: 'dec5 is not three decimals'},
    {key: 'num_1',            validate: _range5_10,  error: 'Number is not within range of 5-10'},
    {key: 'membership',       validate: _membership, error: 'Invalid membership'}

];

function getFacts() {
    let obj = {};
    obj.person = {};
    obj.person.firstName = 'Bill';
    obj.person.lastName = 'Joy';
    obj.person.DOB = new Date();
    obj.person.secret = {};
    obj.person.secret.id = 'myId_isSecret';
    obj.person.secret.pwd = 'secret';
    obj.person.phones = [{type: 'home', number: '8675309'}, {type: 'business', number: '8675309'}];
    obj.person.email = 'Bill@joy.com';
    obj.id = 12345;
    obj.dec3 = '1.233';
    obj.dec4 = '1.2333';
    obj.dec5 = '1.23333';
    obj.num_1 = 5;
    obj.membership = 'Gold';
    return obj;
}

    // Run Example from testValidate.js
    let errorResults = [];
    // Run validation rules on Person
    errorResults.push(_validate.run(validationRulesPerson, getFacts()));
    // Run validation rules on Persons Phone numbers
    getFacts().person.phones.forEach(function(elem) {
        errorResults.push(_validate.run(validationRulesPersonPhones, elem));
    });
    // Will contain all errors found
    errorResults = _.flatten(errorResults);


```

## Decision Table Rules (next WIP)

## Map Rules (WIP)

## Process Rules (WIP)

## Download

The source is available for download from
[GitHub](http://github.com/mallond/rules).

Alternatively, you can install using Node Package Manager [npm](https://www.npmjs.org/package/rulesengine):

    mocha lib/test
    
    mocha lib/test/testValidate.js




