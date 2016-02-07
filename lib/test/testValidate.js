/**
 * Created by dm on 2/6/16.
 */
'use strict';
const validate = require('../validate');
const _ = require('underscore');
var assert = require("assert");

const validateMapPersonPhones = [
    {key: 'type',   validate: _.isString, error: 'phone.type is not a valid string type'},
    {key: 'number', validate: _.isString, error: 'phone.number invalid'}
];

const validationMapPerson = [

    {key: 'person.firstName', validate: _.isString,  error: 'person.firstName not a string'},
    {key: 'person.lastName',  validate: _.isString , error: 'person.lastName not a string'},
    {key: 'person.DOB',       validate: _.isDate,    error: 'person.DOB invalid'},
    {key: 'person.secret.id', validate: _.isString,   error: 'person.secret.id not a string'},
    {key: 'person.secret.pwd',validate: _.isString,   error: 'person.secret.pwd not a string'},
    {key: 'id',               validate: _.isNumber,  error: 'id is not a number'}

];

function getObject() {
    let obj = {};
    obj.person = {};
    obj.person.firstName = 'Bill';
    obj.person.lastName = 'Joy';
    obj.person.DOB = new Date();
    obj.person.secret = {};
    obj.person.secret.id = 'abracadabra';
    obj.person.secret.pwd = 'thunderbird';
    obj.person.phones = [{type: 'home', number: '8675309'}, {type: 'business', number: '8675309'}];
    obj.id = 12345;
    return obj;
}



describe('Validation rules over described Maps', function () {

    let errorResults = [];
    errorResults.push(new validate().run(validationMapPerson, getObject()));
    getObject().person.phones.forEach(function(elem) {
        errorResults.push(new validate().run(validateMapPersonPhones, elem));
    });

    errorResults = _.flatten(errorResults);

    it('should return no errors []', function () {

        assert.equal(0, errorResults.length);

    });

    it('should return person.firstName not a string', function () {
        errorResults = [];
        let obj = getObject();
        obj.person.firstName = 0;
        errorResults.push(new validate().run(validationMapPerson, obj));
        errorResults = _.flatten(errorResults);
        assert.equal('person.firstName not a string', errorResults[0]);

    });

    it('should return person.lastName not a string', function () {
        errorResults = [];
        let obj = getObject();
        obj.person.lastName = 0;
        errorResults.push(new validate().run(validationMapPerson, obj));
        errorResults = _.flatten(errorResults);
        assert.equal('person.lastName not a string', errorResults[0]);

    });

    it('should return phone.type is not a valid string type', function () {
        errorResults = [];
        let obj = getObject();
        obj.person.phones = [{type: 1, number: '8675309'}, {type: 1, number: '8675309'}];
        obj.person.phones.forEach(function(elem) {
            errorResults.push(new validate().run(validateMapPersonPhones, elem));
        });

        errorResults.push(new validate().run(validationMapPerson, obj));
        errorResults = _.flatten(errorResults);
        assert.equal('phone.type is not a valid string type', errorResults[0]);
        assert.equal('phone.type is not a valid string type', errorResults[1]);

    });

    it('should return phone.type is not a valid string type', function () {
        errorResults = [];
        let obj = getObject();
        obj.person.phones = [{type: 1, number: '8675309'}, {type: 1, number: '8675309'}];
        obj.person.phones.forEach(function(elem) {
            errorResults.push(new validate().run(validateMapPersonPhones, elem));
        });

        errorResults.push(new validate().run(validationMapPerson, obj));
        errorResults = _.flatten(errorResults);
        assert.equal('phone.type is not a valid string type', errorResults[0]);
        assert.equal('phone.type is not a valid string type', errorResults[1]);

    });

});



