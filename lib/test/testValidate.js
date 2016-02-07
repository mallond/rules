/**
 * Created by dm on 2/6/16.
 */
'use strict';
const validate = require('../validate');
const _ = require('underscore');
const assert = require("assert");

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


describe('Validation rules over described Validation Rule Maps', function () {
    let errorResults = [];
    errorResults.push(_validate.run(validationRulesPerson, getFacts()));
    getFacts().person.phones.forEach(function(elem) {
        errorResults.push(_validate.run(validationRulesPersonPhones, elem));
    });

    errorResults = _.flatten(errorResults);

    it('should return no errors []', function () {
        assert.equal(0, errorResults.length);
    });

    it('should return person.firstName not a string', function () {
        errorResults = [];
        let obj = getFacts();
        obj.person.firstName = 0;
        errorResults.push(new validate().run(validationRulesPerson, obj));
        errorResults = _.flatten(errorResults);
        assert.equal('person.firstName not a string', errorResults[0]);
    });

    it('should return person.lastName not a string', function () {
        errorResults = [];
        let obj = getFacts();
        obj.person.lastName = 0;
        errorResults.push(_validate.run(validationRulesPerson, obj));
        errorResults = _.flatten(errorResults);
        assert.equal('person.lastName not a string', errorResults[0]);
    });

    it('should return phone.type is not a valid string type', function () {
        errorResults = [];
        let obj = getFacts();
        obj.person.phones = [{type: 1, number: '8675309'}, {type: 2, number: '8675309'}];
        obj.person.phones.forEach(function(elem) {
            errorResults.push(_validate.run(validationRulesPersonPhones, elem));
        });
        errorResults.push(_validate.run(validationRulesPerson, obj));
        errorResults = _.flatten(errorResults);
        assert.equal('phone.type is not a valid string type', errorResults[0]);
        assert.equal('phone.type is not in phone type group', errorResults[1]);
        assert.equal('phone.type is not a valid string type', errorResults[2]);
        assert.equal('phone.type is not in phone type group', errorResults[3]);
    });

    it('should return phone.type is not a valid group type', function () {
        errorResults = [];
        let obj = getFacts();
        obj.person.phones = [{type: 1, number: '8675309'}, {type: 1, number: '8675309'}];
        obj.person.phones.forEach(function(elem) {
            errorResults.push(_validate.run(validationRulesPersonPhones, elem));
        });
        errorResults.push(_validate.run(validationRulesPerson, obj));
        errorResults = _.flatten(errorResults);
        assert.equal('phone.type is not a valid string type', errorResults[0]);
        assert.equal('phone.type is not in phone type group', errorResults[1]);
        assert.equal('phone.type is not a valid string type', errorResults[2]);
        assert.equal('phone.type is not in phone type group', errorResults[3]);
    });

    it('should return person.email is invalid', function () {
        errorResults = [];
        let obj = getFacts();
        obj.person.email = 'bill@';
        errorResults.push(_validate.run(validationRulesPerson, obj));
        errorResults = _.flatten(errorResults);
        assert.equal('person.email is invalid', errorResults[0]);
    });

    it('should run fast < 1ms', function () {
        const begin = new Date().getTime();
        errorResults = [];
        let obj = getFacts();
        obj.person.phones = [{type: 1, number: '8675309'}, {type: 1, number: '8675309'}];
        obj.person.phones.forEach(function(elem) {
            errorResults.push(_validate.run(validationRulesPersonPhones, elem));
        });
        errorResults.push(_validate.run(validationRulesPerson, obj));
        errorResults = _.flatten(errorResults);
        const end = new Date().getTime();
        assert(end-begin < 50);

    });

});



