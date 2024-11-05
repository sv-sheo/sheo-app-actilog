
exports.app = async function({Q, s, SITE}) {

    var b               = {}; // local bin

    b.cookie_soul 	    = await SITE.soul.auth.get_cookie(Q.cookies.soul, SITE.config.code_geass);
    Q.data.soul 	    = await SITE.soul.auth.prove_soul(SITE.DB, b.cookie_soul);
    Q.data.app_data     = await SITE.common.pre.get_app_data(SITE.DB, 'actilog'); // app data = metadata of actilog app
    b.actilog_id        = parseInt(Q.params.id) || 1;
    b.server_errors     = SITE.actilog.pre.get_server_errors({actilog_id: b.actilog_id});
    b.dummy             = b.actilog_id === 1 ? true : false;

    // if some invalid actilog ID is in URL, redirect to actilog 1
    if(b.actilog_id != Q.params.id) {

        s.redirect(b.actilog_id); return {ok: 1};

    } else {

        Q.data.currencies       = await SITE.common.pre.get_currencies(SITE.DB);   
        Q.data.request_id       = Q.id;
        Q.data.socket           = SITE.common.pre.get_socket_data(SITE);
        Q.data.resource_version = Q.data.app_data.resource_version || 1;
        Q.data.webpack_url      = SITE.common.pre.get_webpack_url(Q.data.HOST, 'actilog', SITE.config);
        Q.data.actilog_data     = await DB.GET(SITE.DB, 'actilog', {get: b.actilog_id} );
        Q.data.access_link      = Q.query.xcslnk || '';

        if(Q.data.actilog_data) {

            // RIGHTS
            b.owner_soul_id 		= Q.data.actilog_data.soul_id;
            b.logged_in_soul_id		= M._.get(Q, 'data.soul.id', 0);
            b.soul_owns_this_actilog= (b.owner_soul_id === b.logged_in_soul_id) ? true : false;

            Q.data.rights 	        = SITE.common.other.resolve_app_instance_rights(Q.data.actilog_data.rights, b.owner_soul_id, b.logged_in_soul_id, Q.data.access_link); // {rights: {read: bool, write: bool}}
            Q.data.is_owner 	    = b.soul_owns_this_actilog;

            if( !Q.data.rights.read ) { Q.data.server_error = b.server_errors.actilog_is_private[Q.language] || b.server_errors.actilog_is_private.en; }

        } else { Q.data.server_error = b.server_errors.actilog_not_found[Q.language] || b.server_errors.actilog_not_found.en; }

        Q.alerts            = [];   //{id: 1, type: 'basic', theme: 'success', header: 'Header', text: 'text description text description text description text description '},
                                    //{id: 2, type: 'basic', theme: 'error', header: 'ERROR!', text: 'Some error occured '},

        if(b.dummy) Q.alerts.push(SITE.actilog.pre.get_dummy_alert(Q.language))

        Q.safe              = SITE.actilog.pre.save_request_data(Q, SITE);

        Q.data.html_title   = 'Actilog - Log Your Activities - Sheo';

        Q.data.PRELOAD_DATA = SITE.actilog.pre.get_preload_data(Q, SITE);
        Q.data.PRELOAD_DATA = M.tosource(Q.data.PRELOAD_DATA);

        Q.data.locale       = {cz: 'cs', en: 'en', de: 'de'}[Q.language] || 'en'; // for <html lang=>
        Q.data.view_data    = SITE.actilog.pre.get_no_js_texts(Q.language);   

        s.html              = SITE.views.actilog.app(Q.data);

        return {ok: 1};
                        
    }
    
}

exports.export = async function({Q, s, SITE}) {

    try {

        var b               = {}; // local bin

		b.cookie_soul 	    = await SITE.soul.auth.get_cookie(Q.cookies.soul, SITE.config.code_geass);
		Q.data.soul 	    = await SITE.soul.auth.prove_soul(SITE.DB, b.cookie_soul);
        b.actilog_id        = parseInt(Q.params.id) || 1;

        Q.data.actilog_data     = await DB.GET(SITE.DB, 'actilog', {get: b.actilog_id} ).catch(err=>err);

        if( C.helper.not_error(Q.data.actilog_data) ) {

            // RIGHTS
            b.owner_soul_id 		= Q.data.actilog_data.soul_id;
            b.logged_in_soul_id		= M._.get(Q, 'data.soul.id', 0);
            b.is_owner              = (b.owner_soul_id === b.logged_in_soul_id) ? true : false; // logged in soul owns this actilog

            if(b.is_owner) {

                // all ok, get data
                var data    = {};

                    data.actilog        = Q.data.actilog_data;
                    data.activities     = await DB.GET(SITE.DB, 'actilog_activities', {get: {search: b.actilog_id, index: 'actilog_id'}} );
                    data.projects       = await DB.GET(SITE.DB, 'actilog_projects', {get: {search: b.actilog_id, index: 'actilog_id'}} );
                    data.categories     = await DB.GET(SITE.DB, 'actilog_categories', {get: {search: b.actilog_id, index: 'actilog'}} );
                    data.investors      = await DB.GET(SITE.DB, 'actilog_investors', {get: {search: b.actilog_id, index: 'actilog'}} );
                    data.sources        = await DB.GET(SITE.DB, 'actilog_sources', {get: {search: b.actilog_id, index: 'actilog'}} );
                    data.settings       = await DB.GET(SITE.DB, 'actilog_settings', {get: {search: b.actilog_id, index: 'actilog_id'}} );

                var JSON_DB = JSON.stringify(data);
                var DB_type = M.mimes.lookup('database.json');
                var DB_size = Buffer.byteLength(JSON_DB, 'utf8')
    
                var time    = M.moment().format('YYYY_MM_DD_HH-mm-ss');
                var filename= 'actilog_'+b.actilog_id+'_data_'+time+'.json';
    
                s.setHeader('Content-Type', DB_type);
                s.setHeader('Content-Length', DB_size);
                s.setHeader('Content-Description', 'File Transfer');
                s.setHeader('Content-Type', 'application/octet-stream');
                s.setHeader('Content-Disposition', 'attachment; filename='+filename);
                s.setHeader('Content-Transfer-Encoding', 'binary');
                s.setHeader('Cache-Control', 'no-store');
                s.setHeader('Pragma', 'public');
                //s.setHeader('Access-Control-Allow-Origin', '*');
                s.writeHead(200);
    
                s.result = {code: 200, handled: true, message: '200 Request handled by site.'};
                 
                var buffer = Buffer.from(JSON_DB, 'utf8');
                var bufferStream = new M.stream.PassThrough();
                    bufferStream.end( buffer );
                    bufferStream.pipe( s );
                    bufferStream.on('end', function() {
    
                        //console.log('ended file response on '+filename);
                        s.end();
    
                    });


                // ALTERNATIVE VERSION - this enables to view data in browser (if content-disposition is commented out)
                // STRING SIZE IN BYTES
                //if(TextEncoder) { var string_size_in_bytes     = (new TextEncoder('utf-8').encode("string")).length;
                /*
                var data = {};
                var stream = require('stream');
                var data_string = JSON.stringify(data);
                var string_size_in_bytes     = (new TextEncoder('utf-8').encode(data_string)).length;
            
                s.setHeader('Cache-Control', 'no-store');
                s.setHeader('Content-Type', 'application/json;charset=utf-8');
                s.setHeader('Content-Length', string_size_in_bytes);
                //s.setHeader('Content-Disposition', 'attachment; filename="filename.json"'); // force download
                //s.setHeader('Last-Modified', last_modified); // FORMAT: Last-Modified: <day-name>, <day> <month> <year> <hour>:<minute>:<second> GMT ........... Last-Modified: Tue, 15 Oct 2019 12:45:26 GMT

                //s.setHeader('Access-Control-Allow-Origin', '*'); // CORS
                s.writeHead(200);
                s.result = {code: 200, handled: true, message: '200 Request handled by site.'};
            
                var stream = stream.Readable.from([data_string]);
                    stream.pipe(s);
                    stream.on('end', function() {
            
                        s.end();
                        resolve();
            
                    });*/


            } else { SITE.actilog.html.error_header({code: 401, message: 'Not an owner.'}, Q, s)}

        } else { SITE.actilog.html.error_header({code: 403, message: 'Invalid actilog or DB error: '+Q.data.actilog_data?.message}, Q, s)}

	} catch(error) { SITE.actilog.html.error_header({code: 500, message: '[SAEX1] Unknown error: '+error.message}, Q, s); }

    return {ok: 1};

}

exports.set_lang = async function({Q, s, SITE}) {

    try {

        var langs   = SITE.config.languages.data || {en: {text: 'English'}, cz: {text: 'Česky'} };
        var lang    = Q.query['lang'] || '';
            lang    = langs[lang] ? lang : false;    

        if(lang) {

            let age     = (30*24*60*60);
            let cookie  = C.ciphers.encrypt_sync(lang, SITE.config.code_geass);

            s.cookie.set('language', cookie, age/*, path, domain, http_only*/);

            s.result    = {code: 200, handled: true, message: '200 Request handled by site.'};
            s.writeHead(200, {'Content-Type': 'text/plain'});
            s.end('Successfully set cookie language to '+lang+'.');

        } else { SITE.actilog.html.error_header({code: 403, message: 'Invalid language.'}, Q, s); }

	} catch(error) { SITE.actilog.html.error_header({code: 500, message: 'Unknown set_lang error: '+error.message}, Q, s); }

    return {ok: 1};
    
}