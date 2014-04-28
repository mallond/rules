//     http://www.bizrez.com
//     (c) 2004-2014 David Mallon
//     Freely distributed under the MIT license.



// Closure Object creation
var Facts = (function Facts() {

    "use strict";

    function  Facts(input, output) {

        this.input = input;
        this.output = output;

    }

    return Facts;

})();

module.exports = Facts;






