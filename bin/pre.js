

exports.get_preload_data = function(Q, SITE) {

    let host_split = Q.host.split('.'); host_split.shift(); // actilog.sheo.cz -> ['sheo', 'cz']

    // PRELOAD DATA for JS in HTML
    var PRELOAD_DATA             = Q.data.PRELOAD_DATA || {};
        PRELOAD_DATA.request_id  = Q.id;
        PRELOAD_DATA.languages   = SITE.config.languages || {en: 'English', cz: 'Česky'};
        PRELOAD_DATA.language    = Q.language;
        PRELOAD_DATA.currencies  = Q.data.currencies;
        PRELOAD_DATA.socket      = Q.data.socket;
        PRELOAD_DATA.soul        = Q.data.soul;
        PRELOAD_DATA.app         = Q.data.app_data;
        PRELOAD_DATA.actilog_id  = Q.params.id;
        PRELOAD_DATA.alerts      = Q.alerts || [];
        PRELOAD_DATA.HOST        = Q.data.HOST;
        PRELOAD_DATA.site_host   = Q.protocol+'://'+(host_split.join('.'))+Q.base_url; // https://actilog.sheo.cz/ --> https://sheo.cz/
        PRELOAD_DATA.webpack_url = Q.data.webpack_url;
        PRELOAD_DATA.error       = Q.data.server_error;

        PRELOAD_DATA.resource_version = Q.data.resource_version;

    return PRELOAD_DATA;

}

exports.save_request_data = function(Q, SITE) {

    // data to save in DB (requests)
    var SAFE                = Q.data.safe || {};
        SAFE.soul_id        = Q.data.soul ? Q.data.soul.id : false;
        SAFE.actilog_id     = Q.params.id ? (parseInt(Q.params.id) || false) : false; // NaN cannot be in safe (cant be saved to DB)
        SAFE.access_link    = Q.data.access_link || '';
        SAFE.site           = SITE.name;
        SAFE.client_ip      = Q.client_ip;

    return SAFE;

}

exports.prove_socket_authorization = async function(Q, SITE) {

    var b 			= {};
    var result      = {ok: 0, data: {}, error: null, text: ''};

    try {

        b.socket_time 	= M.moment().format('x');
        b.older_than_day= ((b.socket_time - Q.start_time) > 86400000);

        // if socket action was triggered on a request that is more than 1 day old, return error
        if( !b.older_than_day ) {

            // get actilog data
            let actilog_data = await DB.GET(SITE.DB, 'actilog', {get: Q.safe?.actilog_id});

            if(C.helper.not_error(actilog_data)) {

                if(actilog_data) {

                    // now check usage rights - full rights if it belongs to the logged in soul, if not, check rights
                    // mutate actilog rights object -> {rights: {read: bool, write: bool}}
                    // possible right values: public, limited, private, none
                    b.owner_soul_id 		= actilog_data.soul_id;
                    b.logged_in_soul_id		= Q.safe.soul_id;
                    b.access_link		    = Q.safe.access_link || '';
                    b.soul_owns_this_actilog= (b.owner_soul_id === b.logged_in_soul_id) ? true : false;

                    actilog_data.rights 	= SITE.common.other.resolve_app_instance_rights(actilog_data.rights, b.owner_soul_id, b.logged_in_soul_id, b.access_link); // must return an object like this {read: bool, write: bool}
                    actilog_data.is_owner 	= b.soul_owns_this_actilog;

                    result.ok               = 1;
                    result.data             = actilog_data;
                    result.error            = null;

                    return Promise.resolve(result);

                } else { result.text = 'Actilog ['+Q?.safe?.actilog_id+'] not found.'; }

            } else { result.error = actilog_data; result.text = 'Failed to get actilog data - DB error: '+actilog_data?.message; }

        } else { result.text = 'Parent request of socket action is expired.'; }

    } catch(error) { result.error = error; result.text = 'Unknown prove_socket_authorization error: '+error.message; }

    return result;

}

exports.get_no_js_texts = function(lang) {

    var texts_by_lang = {

        cz: {header: 'CHYBA', text: 'Pro zobrazení této stránky je potřeba Javascript.<br>Zapněte si jej, prosím, v nastavení Vašeho prohlížeče nebo kontaktujte správce (sheo.vetesia@gmail.com).', },
        en: {header: 'ERROR', text: 'Javascript is needed to view this page<br>Please, turn it on in your browser settings or contact the administrator (sheo.vetesia@gmail.com).'},
        de: {header: 'FEHLER', text: 'Javascript ist erforderlich, um diese Seite anzuzeigen.<br>Bitte aktivieren Sie es in Ihren Browsereinstellungen oder wenden Sie sich an den Administrator (sheo.vetesia@gmail.com).', },

    }

    return texts_by_lang[lang] || texts_by_lang.en;

}

exports.get_server_errors = function(data) {

    var server_errors = {

        actilog_not_found: {cz: 'Actilog '+data.actilog_id+' neexistuje.', en: 'Actilog '+data.actilog_id+' does not exist.', de: 'Actilog '+data.actilog_id+' existiert nicht.'},
        actilog_is_private: {cz: 'Actilog '+data.actilog_id+' je soukromý.', en: 'Actilog '+data.actilog_id+' is private.', de: 'Actilog '+data.actilog_id+' ist privat.'},

    };


    return server_errors;

}

exports.get_dummy_alert = function(lang) {

    var langs   = {cz:'cz', en: 'en', de: 'de'};
        lang    = langs[lang] || 'en';
    var content = {

        cz: {header: 'Demo mód', text: 'Jste v demo módu - úpravy nebudou uloženy. Pro plně funkční actilog se prosím přihlašte.'},
        en: {header: 'Demo mode', text: 'Changes will not be saved. Please log in to get the full actilog experience.'},
        de: {header: 'Demo Mode', text: 'Änderungen werden nicht gespeichert. Bitte melden Sie sich an, um die volle actilog-Erfahrung nutzen zu können.'},

    }


    return {id: 1, type: 'basic', theme: 'info', header: content[lang].header, text: content[lang].text};

}