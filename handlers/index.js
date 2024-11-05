
// !!! - ONLY FOR PURPOSES OF BUNDLING APP HANDLERS - !!!
// ... app handlers are being additionally added to site handlers in site middleware - unlike regular handlers in site/handlers, which are being loaded by special method in CORE during site setup

let rr = require.resolve; // force_require to enable handlebars reload (dev purposes)

exports.get = C.helper.force_require(rr('./get.js'));