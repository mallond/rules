/**
 * Created by dm on 2/6/16.
 */
'use strict';

var _ = require('underscore');


class Validate {

    /**
     * Main Validator requires Validation Rules Table, and Object to validate
     * @param validationMap
     * @param objectToValidate
     */
    run(validationMap, objectToValidate) {

        var errors = null;

        // Ensure arguments are objects - Critical error
        if (!_.isObject(validationMap)) {return  ['Critical: validationMap is not an object'];}
        if (!_.isObject(objectToValidate)) {return ['Critical: objectToValidate is not an object'];}

        return (function() {

            // Iterate over validation rules and invoke 'validate'
            _.each(validationMap, function (elem) {

                // Tokenize the key key = person.name etc
                var tokens = elem.key.split('.');
                var dynamicKey = ['objectToValidate'];
                var index = 0;

                // Create Dynamic Keys for JSON lookup
                _.each(tokens, function() {
                    dynamicKey.push('[tokens['+ index + ']]');
                    index++;
                });

                // Dynamically Create function to retrieve value from objectToValidate
                const lookup = new Function('objectToValidate', 'tokens', 'return '+dynamicKey.join('')+'');
                const value = lookup(objectToValidate, tokens);

                // validate is a function reference described on the validationMap
                if (!elem.validate(value)) {
                    errors = errors===null? errors=[]: errors;
                    errors.push(elem.error);
                }
            });

            errors = errors===null? errors=[]: errors;
            return errors;

        })();
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
        return function _isDecimal(number)
        {
            const newR = new RegExp('^(\\d+)?([.]?\\d{'+ PRECISION +','+ PRECISION + '})?$', 'g');
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
        return function _range(number)
        {
            return (number >= FROM) && (number <= TO);
        };
    }

    /**
     * Helper Function - first class function - prime the pump with GROUP
     * @param GROUP initializer
     * @returns {Function}
     */
    inGroup(GROUP) {
        return function _inGroup(value)
        {
            return _.indexOf(GROUP, value)>=0;
        };
    }
}

module.exports = Validate;

