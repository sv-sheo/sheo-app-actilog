

// sends new data to the server
exports.save_setting = function({value_object, input, remote, set_remote, set_form, segment, settings, set_settings, rights, dummy, lang}) {

    var l = WH.locales.GET(lang, 'content.general');

    if(!remote.sending) {

        set_remote({type: 'set_sending', sending: 1});

        var to_send 	= {value: value_object.value, field: input.name, segment};

        // imitating async save
        //window.setTimeout(function() {set_remote({type: 'set_sending_sent', sending: 0}); window.setTimeout(()=>{set_remote({type: 'set_sent_off'})}, 10000)}, 10000);

        M.socket.execute('ACTILOG', 'actilog_update_setting', {action: 'actilog_update_setting', ...to_send}, {return: true})
        .then((result) => {

            var result_formatted = {ok: result.ok, error: ''};

            if(result.ok) {

                var new_settings = _.cloneDeep(settings);
                    new_settings[segment][input.name] = result.data.proved.value;

                set_settings(new_settings);

            } else { 

                // value wasnt updated in DB, change the local state value to original value (before change)
                value_object.value = value_object.original_value;
                set_form({type: 'input', field: input.name, value_object});

                let proved_errors = result?.errors ? result.errors.join('<br>') : '';

                result_formatted.error = result.id+' '+result.text + proved_errors; 
                M.log.error({id: '[ACTILOG_SETTINGS_FORM_01]', message:  'SOCKET RESULT ERROR', result}); 
            
            }

            set_remote({type: 'set_remote', result: {sending: 0, sent: 1, result: result_formatted}});

            window.setTimeout(()=>{ set_remote({type: 'set_sent_off'}); }, 2000);

        }).catch((error) => {

            set_remote({type: 'set_remote', result: {sending: 0, sent: 1, result: {ok: 0, error: error.message}}});

            M.log.error({id: '[ACTILOG_SETTINGS_FORM_02]', message:'SOCKET ERROR', error});

        });

    }

}

exports.format_result = function(field, remote, lang) {

    var result;
    var l       = {settings: WH.locales.GET(lang, 'content.settings'), general: WH.locales.GET(lang, 'content.general')};

    if(remote.sending) {

        result = <C.INPUT_STATUS props={{state: 'saving', text: l.general.saving, custom_class: ''}} />;


    } else {

        if(remote.sent) {

            if(remote.result.ok) {  result = <C.INPUT_STATUS props={{state: 'success', text: l.general.saved, custom_class: ''}} />; }
            else {                  result = <C.INPUT_STATUS props={{state: 'error', text: remote.result.error, custom_class: ''}} />; }

        }

        if(field.text) result = <C.INPUT_STATUS props={{state: 'info', text: field.text, custom_class: ''}} />
        if(field.error)result = <C.INPUT_STATUS props={{state: 'error', text: field.error, custom_class: ''}} />

    }

    return result;

}

exports.refresh_content = function(content, set, settings) {

    var new_content = _.cloneDeep(content);

    // recalculate sums of projects, categories, investors, sources
    new_content.activities 	= S.activities.format_activities(new_content);
    new_content.projects 	= S.projects.format_projects(new_content);
    new_content.categories 	= S.categories.format_categories(new_content);
    new_content.investors 	= S.investors.format_investors(new_content);
    new_content.sources 	= S.sources.format_sources(new_content);

    set.activities(new_content.activities);
    set.projects(new_content.projects);
    set.categories(new_content.categories);
    set.investors(new_content.investors);
    set.sources(new_content.sources);

}

exports.save_rights_link = function({type, remote, set_remote}) {

    var result = Promise.resolve({ok: 0, data: {}, error: 'Cannot proceed while another request is pending.'}); 

    if(!remote.sending) {

        set_remote({type: 'set_sending', sending: 1});

        result = M.socket.execute('ACTILOG', 'actilog_toggle_rights_link', {action: 'actilog_toggle_rights_link', type}, {return: true})
                        .then((socket_result)=>{

                            if(socket_result.ok) {  return socket_result; } // {ok: 1, data: {new_link:''}, error: null }
                            else {                  return {ok: 0, data: {socket_result}, error: socket_result?.id+' '+socket_result?.text}; }

                        }).catch((error)=>{

                            M.log.error({id: '[ACTILOG_RIGHTS_FORM_03]', message:'SOCKET ERROR', error});
                            return {ok: 0, data: {error}, error: error.message};

                        });

    }

    return result;

}

exports.save_right_souls = function({type, value_object, input, remote, set_remote, set_form, lang}) {

    if(!remote.sending) {

        set_remote({type: 'set_sending', sending: 1});

        var to_send 	= {value: value_object.value, type, lang};

        M.socket.execute('ACTILOG', 'actilog_update_rights_souls', {action: 'actilog_update_rights_souls', ...to_send}, {return: true})
        .then((result) => {

            var result_formatted = {ok: result.ok, error: ''};

            if(result.ok) {

                // update adjusted value of right_souls (removed duplicates etc...)
                var new_value   = [];
                var new_text    = [];

                _.forEach(result.data.right_souls, function(soul_id) { new_value.push(soul_id); new_text.push(result.data.souls_names[soul_id]); });

                value_object.value  = new_value.join(',');
                value_object.text   = '';

                set_form({type: 'input', field: input.name, value_object});

                // after 2 seconds, hide remote result status and show text of new souls 
                window.setTimeout(()=>{ 
                    
                    value_object.text = new_text.join(', ');

                    set_form({type: 'input', field: input.name, value_object});
                    set_remote({type: 'set_sent_off'}); 
                
                }, 2000);

            } else { 

                result_formatted.error = result.id + ' '+result.text; 
                M.log.error({id: '[ACTILOG_RIGHT_SOULS_FORM_01]', message:  'SOCKET RESULT ERROR', result}); 
            
            }

            set_remote({type: 'set_remote', result: {sending: 0, sent: 1, result: result_formatted}});

        }).catch((error) => {

            set_remote({type: 'set_remote', result: {sending: 0, sent: 1, result: {ok: 0, error: error.message}}});
            M.log.error({id: '[ACTILOG_RIGHT_SOULS_FORM_02]', message:'SOCKET ERROR', error});

        });

    }

}

exports.save_right = function({type, value_object, input, remote, set_remote, set_form, lang}) {

    if(!remote.sending) {

        set_remote({type: 'set_sending', sending: 1});

        var to_send 	= {value: value_object.value, type, lang};

        M.socket.execute('ACTILOG', 'actilog_update_rights', {action: 'actilog_update_rights', ...to_send}, {return: true})
        .then((result) => {

            var result_formatted = {ok: result.ok, error: ''};

            if(result.ok) {

                window.setTimeout(()=>{ set_remote({type: 'set_sent_off'}); }, 2000);

            } else { 

                result_formatted.error = result.id + ' ' + result.text;
                M.log.error({id: '[ACTILOG_RIGHT_FORM_01]', message:  'SOCKET RESULT ERROR', result}); 
            
            }

            set_remote({type: 'set_remote', result: {sending: 0, sent: 1, result: result_formatted}});

        }).catch((error) => {

            set_remote({type: 'set_remote', result: {sending: 0, sent: 1, result: {ok: 0, error: error.message}}});
            M.log.error({id: '[ACTILOG_RIGHT_FORM_02]', message:'SOCKET ERROR', error});

        });

    }

}