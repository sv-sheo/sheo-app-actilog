
// mutates main site_config
module.exports = function(conf, site_config) {

    site_config.apps.actilog            = {};

    let app_conf                        = site_config.apps.actilog;

    app_conf.name                       = 'actilog';
    app_conf.webpack_dev_server_port    = 4336;
    app_conf.webpack_dev_server_protocol= 'http';
    app_conf.root                       = 'apps/actilog';

    app_conf.files                      = {

        dir:        'apps/actilog/files',
        // temp_dir:   './files/temp', // optional - taken from site or core
        // max_size:   20, // max size in MB of all files in POST // optional - taken from site or core

    }

    // EXTEND MAIN SITE_CONFIG
    site_config.hosts['actilog.sheo.ss'] = 'actilog.sheo.ss'; // localhost domain
    site_config.hosts['actilog.sheo.cz'] = 'actilog.sheo.cz'; // production domain

    // returns nothing

}