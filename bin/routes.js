
// required in site router

// only for the actilog.sheo.cz subdomain
let not_found_url 			= '(<a>(/<b>(/<c>(/<d>(/<e>(/<f>(/<g>(/<h>(/<ch>(/<i>(/<j>(/<k>(/<l>(/<m>(/<n>(/<o>))))))))))))))))';
let files_get_url 			= 'files/get/<p1>(/<p2>(/<p3>(/<p4>(/<p5>(/<p6>(/<p7>(/<p8>(/<p9>(/<p10>)))))))))';

module.exports = {

                    //'auto':             {url: '<handle_0>/<handle_1>(/<user_id>)', handler: '<handle_0>/<handle_1>/detail', regexps: {'<user_id>': /^\d+$/}},
                
                    // FILES
                    'files-get':        {url: files_get_url, handler: 'files/get_file'},
                        
                    // INDEX ROUTE
                    'export':           {url: '<id>/export', handler: 'actilog/get/export', method: 'get'},
                    'set_lang':         {url: 'set_lang', handler: 'actilog/get/set_lang', method: 'get'},

                    // INDEX ROUTE
                    'index':            {url: '(<id>(/<a>(/<b>(/<c>(/<d>))))))', handler: 'actilog/get/app', method: 'get'},
                        
                    // HANDLEBARS RELOAD
                    'handlebars-reload':{url: 'handlebars_reload', handler: 'index/handlebars_reload'},

                    // 404 ROUTE - has to be last
                    'not_found':        {url: not_found_url, handler: 'index/not_found'},    

                }