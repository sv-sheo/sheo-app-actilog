

let rr = require.resolve;

exports.pre 		= C.helper.force_require(rr('./pre.js'));
exports.html 		= C.helper.force_require(rr('./html.js'));
exports.validate 	= C.helper.force_require(rr('./validate.js'));