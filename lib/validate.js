/**
 * Created by dm on 2/6/16.
 */
'use strict';

var _ = require('underscore');


class Validate {

    /**
     *
     * @param validationMap
     * @param objectToValidate
     */
    run(validationMap, objectToValidate) {

        var errors = null;

        // Ensure arguments are objects - Severe error
        if (!_.isObject(validationMap)) {return  ['validationMap is not an object'];}
        if (!_.isObject(objectToValidate)) {return ['objectToValidate is not an object'];}

        return (function() {

            _.each(validationMap, function (elem, context) {
                var tokens = elem.key.split('.');
                var dynamicKey = ['objectToValidate'];
                var index = 0;
                // Create Dynamic Keys
                _.each(tokens, function(elem, context) {
                    dynamicKey.push('[tokens['+ index + ']]');
                    index++;
                });
                // Eval isSafe via Function Enclosure
                var value = eval(dynamicKey.join(''));
                if (!elem.validate(value)) {
                    errors = errors===null? errors=[]: errors;
                    errors.push(elem.error);
                }
            });

            errors = errors===null? errors=[]: errors;
            return errors;

        })();

    }


}

module.exports = Validate;
