/**
 * Created by dm on 2/6/16.
 */
/**
 *
 * Validation Class - Collection processing of validation rules over objects.constructor.constructor.
 * Describe your validations in a table-like manner not everywhere in your code. Easy reference, lookup and change
 *
 */
'use strict';
const _ = require('underscore');


class Validate {

    constructor() {}

    /**
     * Main Validator requires Validation Rules Table, and Object to validate
     * @param validationMap
     * @param objectToValidate
     * @returns [] arraay of errors | empty array with no errors
     */
    run(validationMap, objectToValidate) {

        var errors = null;
        // Ensure arguments are objects - Critical error
        if (!_.isObject(validationMap)) {return ['Critical: validationMap is not an object'];}
        if (!_.isObject(objectToValidate)) {return ['Critical: objectToValidate is not an object'];}

        // Iterate over validation rules and invoke 'validate'
        _.each(validationMap, function (rules) {
            // lookup object to validates value by key
            const value = lookupValue(objectToValidate, rules.key);
            // validate is a function reference described within the validationMap
            if (!rules.validate(value)) {
                errors = errors === null ? errors = [] : errors;
                errors.push(rules.error);
            }
        });
        // No errors return empty array
        errors = errors === null ? errors = [] : errors;
        return errors;

    }


    /**
     * Helper Function
     * @param email
     * @returns {boolean}
     */
    isEmail(email) {
        const regexp = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        return regexp.test(email);
    }

    /**
     * Helper Function - first class function - prime the pump with PRECISION
     * @param PRECISION
     * @returns {boolean}
     */
    isDecimal(PRECISION) {
        return function _isDecimal(number) {
            const newR = new RegExp('^(\\d+)?([.]?\\d{' + PRECISION + ',' + PRECISION + '})?$', 'g');
            return newR.test(number);
        };
    }

    /**
     * Helper Function - first class function - prime the pump with FROM TO
     * @param FROM
     * @param TO
     * @returns {Function}
     */
    range(FROM, TO) {
        return function _range(number) {
            return (number >= FROM) && (number <= TO);
        };
    }

    /**
     * Helper Function - first class function - prime the pump with GROUP
     * @param GROUP initializer
     * @returns {Function}
     */
    inGroup(GROUP) {
        return function _inGroup(value) {
            return _.indexOf(GROUP, value) >= 0;
        };
    }
}

/**
 * Module specific embedded function
 * Constraint Return 5 levels deep - Constraint
 * @param objectToValidate
 * @param key ie. person.phone.type
 * @returns {*}
 */
var lookupValue = function(objectToValidate, key) {

    const names = key.split('.');
    var lookupIndex = null;
    var i = names.length-1;
    switch (i) {
        case 0:
            lookupIndex = objectToValidate[names[i]];
            break;
        case 1:
            lookupIndex = objectToValidate[names[i-1]][names[i]];
            break;
        case 2:
            lookupIndex = objectToValidate[names[i-2]][names[i-1]][names[i]];
            break;
        case 3:
            lookupIndex = objectToValidate[names[i-3]][names[i-2]][names[i-1]][names[i]];
            break;
        case 4:
            lookupIndex = objectToValidate[names[i-4]][names[i-3]][names[i-2]][names[i-1]][names[i]];
            break;
    }

    return lookupIndex;
};

module.exports = Validate;

