
/*exports.compile = (Q, s, SITE) => {
    
    // IMPORTANT
    //Q.data.js_data          = JSON.stringify(Q.data.js_data);
    //Q.data.js_data          = M.util.inspect(Q.data.js_data, true, 20);
    //Q.data.js_data          = M.json.stringify(Q.data.js_data);
    Q.data.js_data          = M.tosource(Q.data.js_data);
  
    //Q.data.html.content     = SITE.views.hp.content(Q.data);
    s.html                  = SITE.views.actilog.index(Q.data);
    
}*/

exports.error_header = function(data = {}, Q, s) {

    var codes           = {401: 401, 403: 403, 404: 404, 500: 500};
    var code            = codes[data.code] || 500;
    var message         = data.message || '';
    var HTTP_messages   = {401: '401 Unauthorized', 403: '403 Forbidden', 404: '404 Not found', 500: '500 Server error'};
    var HTTP_message    = HTTP_messages[code];

    s.result = {code, handled: true, message: HTTP_message};
    s.writeHead(403, {'Content-Type': 'text/plain'});
    s.end(HTTP_message+': '+message);

}