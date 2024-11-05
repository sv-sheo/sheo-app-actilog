// DOCUMENTATION
//https://webpack.js.org/api/node
//https://webpack.github.io/docs/webpack-dev-server.html
//https://webpack.js.org/guides/production-build/

const path          = require('path');
const webpack       = require("webpack");
const dev_server    = require("webpack-dev-server");
let     config_     = {};
        config_.dev = require('./config_dev');
        config_.prod= require('./config_prod');

let action  = process.argv[2];                                          // example call: node webpack <action> <mode>       action=run|watch        mode=dev|prod
    action  = ['run', 'watch'].indexOf(action) >= 0 ? action : false;   // validate action: only possible values: 'run' and 'watch'

let mode    = process.argv[3];                                          // get config from arguments, by default 'dev', possible values: 'dev' or 'prod'
    mode    = ['dev', 'prod'].indexOf(mode) >= 0 ? mode : 'dev';      

let run_handler     = require('./run');     // compiler.run() handler ... same for all webpacks
//let watch_handler   = require('../../../webpack/watch');   // compiler.watch() handler ... not needed

let config          = config_[mode];

const compiler      = webpack(config); // you can supply more configs, they ll be run synchronousl in order i.e. webpack(config1, config2);

//process.argv is an array containing the command line arguments. The first element will be 'node', the second element will be the name of the JavaScript file. The next elements will be any additional command line arguments.

// run action creates final build
// watch action starts watching boots up dev server

if(action) {
    
    // RUN
    if(action === 'run') {

        compiler.run(run_handler);

    }
 
    // WATCH
    if(action === 'watch') {
        
        let dev_server_port = 4336; // INSTANCE CHANGE HERE (source = 3333)

        let dev_server_options = {

            /* VALID OPTIONS 
            
                allowedHosts, bonjour, client, compress, devMiddleware, headers, historyApiFallback, host,
                hot, http2, https, ipc (socket), liveReload, magicHtml, onAfterSetupMiddleware, onBeforeSetupMiddleware
                onListening, open, port, proxy, server, setupExitSignals, static, watchFiles, webSocketServer,

            */
            
            host:           'localhost',
            port:           dev_server_port,

            headers: {
                
                // allow CORS (acces from localhost)
                "Access-Control-Allow-Origin": "*",
                "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, PATCH, OPTIONS",
                "Access-Control-Allow-Headers": "X-Requested-With, content-type, Authorization"
                
            },

            static: {

                directory:          path.resolve(__dirname, '../files/'),// sites/sheo/webpack/files/ -> serving static files (icons etc) mentioned inside JS and CSS
                staticOptions:      {},
                publicPath:         "/files/get/",  // = default value -> all files created by webpack will be accessible like http://localhost:3000/bundle.js 
                                                    // !!! Make sure publicPath always starts and ends with a forward slash.
                                                    // Can be: publicPath: ['/static-public-path-one/', '/static-public-path-two/'],

                serveIndex:         true,           // Can be: serveIndex: {} (options for the `serveIndex` option you can find https://github.com/expressjs/serve-index)
                watch:              true,           // Can be: watch: {} (options for the `watch` option you can find https://github.com/paulmillr/chokidar)

            },

            // certificates dont work, screw it
            /*server: {

                type: 'https', // webpack dev server has its own self signed certificate (doesnt work), you can use your own (viz https://webpack.js.org/configuration/dev-server/#devserverserver)
                options: {
                    //ca: './path/to/server.pem',
                    //pfx: './path/to/server.pfx',
                    key: '../../../../../CORE/security/certificates/https/key.pem',
                    cert: '../../../../../CORE/security/certificates/https/cert.pem',
                    //passphrase: 'webpack-dev-server',
                    requestCert: true,
                  },

            },*/

            devMiddleware: {

                stats:          'normal',       // "errors-only", "minimal", "none", "normal", "verbose"

            },

            allowedHosts: 'all', // ['.host.com', 'host2.com'],

            hot: 'only',
            
        }
        
        // turn on dev server
        let server = new dev_server(dev_server_options, compiler);

            //server.listen(dev_server_port); DEPRECATED

        (async () => {

            await server.start();
            console.log("Webpack Dev Server running");

        })();
        
    }
    
} else { console.log('MISSING or INVALID ACTION argument. Possible values: "run" or "watch"'); }