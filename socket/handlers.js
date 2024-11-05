

//exports.get_actilog_data = C.promise.new(function(resolve, reject, Q, socket, SITE, DB, data, result) {
exports.get_actilog_data = async function(Q, socket, SITE, data = {}) {

    let result = {ok: 0, data: {}, error: null, id: '[ssae001]', text: ''};

    try {

        let socket_time 	= M.moment().format('x');
        let older_than_day	= ((socket_time - Q.start_time) > 86400000);

        // if socket action was triggered on a request that is more than 1 day old, return error
        if( !older_than_day ) {

            // get actilog data
            let actilog_data = await DB.GET(SITE.DB, 'actilog', {get: Q.safe.actilog_id});

            if(C.helper.not_error(actilog_data)) {

                if(actilog_data) {

                    // now check usage rights - full rights if it belongs to the logged in soul, if not, check rights
                    // mutate actilog rights object -> {rights: {read: bool, write: bool}}
                    // possible right values: public, limited, private, none
                    let owner_soul_id 			= actilog_data.soul_id;
                    let logged_in_soul_id		= Q.safe?.soul_id || false;
                    let access_link				= Q.safe?.access_link || '';
                    let soul_owns_this_actilog	= (owner_soul_id === logged_in_soul_id) ? true : false;

                    actilog_data.full_rights= soul_owns_this_actilog ? actilog_data.rights : null;
                    actilog_data.rights 	= SITE.common.other.resolve_app_instance_rights(actilog_data.rights, owner_soul_id, logged_in_soul_id, access_link); // must return an object like this {read: bool, write: bool}
                    actilog_data.is_owner 	= soul_owns_this_actilog;

                    // if soul has read and/or write rights, fetch actilog content data
                    if(actilog_data.rights.read || actilog_data.rights.write) {

                        var promises = {

                            /*activities: DB.GET(Q.DB, 'actilog_activities', {filter: {soul_id: actilog_data.soul_id, actilog_id: actilog_data.id}}),
                            projects:	DB.GET(Q.DB, 'actilog_projects', {filter: {soul_id: actilog_data.soul_id, actilog_id: actilog_data.id}}),
                            categories:	DB.GET(Q.DB, 'actilog_categories', {filter: {soul: actilog_data.soul_id, actilog: actilog_data.id}}),
                            investors:	DB.GET(Q.DB, 'actilog_investors', {filter: {soul: actilog_data.soul_id, actilog: actilog_data.id}}),
                            sources:	DB.GET(Q.DB, 'actilog_sources', {filter: {soul: actilog_data.soul_id, actilog: actilog_data.id}}),
                            settings:	DB.GET(Q.DB, 'actilog_settings', {filter: {actilog_id: actilog_data.id}, limit: 1, format: 'single'}),*/
                            // faster - via indexes
                            activities: 	DB.GET(SITE.DB, 'actilog_activities', {get: {search: actilog_data.id, index: 'actilog_id'}} ),
                            projects: 		DB.GET(SITE.DB, 'actilog_projects', {get: {search: actilog_data.id, index: 'actilog_id'}} ),
                            categories: 	DB.GET(SITE.DB, 'actilog_categories', {get: {search: actilog_data.id, index: 'actilog'}} ),
                            investors: 		DB.GET(SITE.DB, 'actilog_investors', {get: {search: actilog_data.id, index: 'actilog'}} ),
                            sources: 		DB.GET(SITE.DB, 'actilog_sources', {get: {search: actilog_data.id, index: 'actilog'}} ),
                            settings: 		DB.GET(SITE.DB, 'actilog_settings', {get: {search: actilog_data.id, index: 'actilog_id'}, format: 'single'} ),

                        }

                        //return Promise.resolve(true).parallel(promises).then((content) => Promise.resolve(content)).catch((err) => Promise.reject(err));

                        let parallel_result = await C.promise.parallel(promises).catch(err=>err);

                        if( C.helper.not_error(parallel_result) ) {

                            actilog_data.content = C.helper.get_resolved(parallel_result);

                            if(C.helper.not_error(actilog_data.content.activities, actilog_data.content.projects, actilog_data.content.categories, actilog_data.content.investors, actilog_data.content.sources, actilog_data.content.settings)) {

                                result.ok = 1;
                                result.text = 'Successfully got actilog data.';
                                result.data.actilog = actilog_data

                            } else { result = {...result, id: '[ssae007]', data: {parallel_results}, text: 'Failed to get actilog data - inside parallel error.'}; }

                        } else { result = {...result, id: '[ssae006]', error: parallel_result, text: 'Failed to get actilog data - parallel error: '+parallel_result?.message}; }

                    } else { result = {...result, id: '[ssae005]', text: 'Not authorized to view this actilog.'}; }

                } else { result = {...result, id: '[ssae004]', text: 'Actilog ['+Q?.safe?.actilog_id+'] not found.'}; }

            } else { result = {...result, id: '[ssae003]', error: actilog_data, text: 'Failed to get actilog - error: '+actilog_data?.message}; }

        } else { result.id = '[ssae002]'; result.text = 'Parent request of socket action is expired.'; }

    } catch(error) { result = {...result, error, text: 'Failed to fetch actilog data - error: '+error.message}; }

    return result;
    
};

exports.upsert_activity = async function(Q, socket, SITE, data = {}) {

    var auth    = await SITE.actilog.pre.prove_socket_authorization(Q, SITE).catch(err=>{ return {ok: 0, error: err, text: 'Unknown prove_socket_authorization error: '+err.message}; });
    let result  = {ok: 0, data: {}, error: null, id: '[se008]', text: ''};
    
    if(auth.ok) {

        var actilog_data 	= auth.data;
        var rights 			= auth.data.rights;
        var settings		= await DB.GET(SITE.DB, 'actilog_settings', {get: Q.safe?.actilog_id}).catch(err=>err);
        var lang 		 	= data.lang || SITE.config?.languages?.default || 'en';
            lang 		 	= SITE.config.languages.data[lang] ? lang : (SITE.config?.languages?.default || 'en');

        if(rights.write) {

            // INSERT (ADD) PART of UPSERT________________________
            if(data.mode === 'add') {

                var last_activity= await DB.GET(SITE.DB, 'actilog_activities', {order_by: ['id', 'desc', true], limit: 1, format: 'single'}).catch(err=>err);

                // succesfully got last activity
                if( C.helper.not_error(last_activity) ) {

                    // adjust form data
                    var new_activity 			= SITE.actilog.validate.activity_adjust(data.activity, settings);
                        new_activity.id 		= (last_activity?.id || 0) + 1;
                        new_activity.actilog_id = Q.safe.actilog_id;
                        new_activity.soul_id 	= auth.data.soul_id;

                    // validate activity
                    var proofs			= SITE.actilog.validate.activity_proofs;
                    let proved			= C.helper.prove.values({data: new_activity, proofs, lang});

                    if(proved.ok) {

                        var insert = await DB.SET(SITE.DB, 'actilog_activities', new_activity).catch(err=>err);

                        if( C.helper.not_error(insert) ) {

                            result.ok = 1;
                            result.data = {new_activity, proved};
                            result.error = null;

                        } else { result = {...result, id:'[ssaue05]', error: insert, text: 'Failed to insert new activity - DB Error: '+insert.message}; }

                    } else { result = {...result, id:'[ssaue04]', text: 'Invalid activity data.', errors: proved.errors}; }

                } else { result = {...result, id:'[ssaue03]', error: last_activity, text: 'Failed to get last activity - DB Error: '+last_activity.message}; }

            // UPDATE (EDIT) PART of UPSERT ______________________________________
            } else if(data.mode === 'edit') {

                var db_activity = await DB.GET(SITE.DB, 'actilog_activities', {get: data.activity_id}).catch(err=>err);

                // succesfully got activity to edit
                if( C.helper.not_error(db_activity) ) {

                    // make sure the activity belongs to this actilog, soul is handled in the rights
                    if(db_activity?.actilog_id === Q.safe?.actilog_id) {

                        // adjust form data
                        var fields_to_update = SITE.actilog.validate.activity_adjust(data.activity);

                        // validate activity
                        var proofs			= SITE.actilog.validate.activity_proofs;
                        let proved			= C.helper.prove.values({data: fields_to_update, proofs, lang});

                        if(proved.ok) {

                            // update the activity
                            var update = await DB.CHANGE(SITE.DB, 'actilog_activities', {get: db_activity.id}, fields_to_update).catch(err=>err);

                            if( C.helper.not_error(update) ) {

                                result.ok = 1;
                                result.data = {update, updated_fields: fields_to_update, activity_id: db_activity.id};
                                result.error = null;
    
                            } else { result = {...result, id:'[ssaue15]', error: update, text: 'Failed to update activity ['+data.activity_id+'] - DB Error: '+update.message}; }

                        } else { result = {...result, id:'[ssaue16]', text: 'Invalid activity data.', errors: proved.errors}; }

                    } else { result = {...result, id:'[ssaue14]', text: 'Cannot update activities of different actilogs.'}; }

                } else { result = {...result, id:'[ssaue13]', error: db_activity, text: 'Failed to get activity ['+data.activity_id+'] to edit - DB Error: '+db_activity.message}; }

            }

        } else { result = {...result, id:'[ssaue02]', text: 'Updating actilog not permitted.'}; }

    } else { result = {...result, id:'[ssaue01]', ...auth}; }

    return result;

};

exports.remove_activity = async function(Q, socket, SITE, data = {}) {

    let result  = {ok: 0, data: {}, error: null, id: '', text: ''};

    try {
        
        var auth = await SITE.actilog.pre.prove_socket_authorization(Q, SITE).catch(err=>{ return {ok: 0, error: err, text: 'Unknown prove_socket_authorization error: '+err.message}; });
        
        if(auth.ok) {

            var actilog_data 	= auth.data;
            var rights 			= auth.data.rights;

            if(rights.write) {

                var activity_id 	= parseInt(data.data.activity) || 0;

                var activity 		= await DB.GET(SITE.DB, 'actilog_activities', {get: activity_id}).catch(err=>err);

                if(C.helper.not_error(activity) && activity?.id) {

                    // check if activity belongs to actilog
                    if(Q.safe?.actilog_id === activity.actilog_id) {

                        // now remove the activity
                        var rem 	= await DB.REMOVE(SITE.DB, 'actilog_activities', {get: activity.id}).catch(err=>err);

                        if( C.helper.not_error(rem) ) {

                            result.ok = 1;
                            result.data = data.data;
                            result.error = null;

                        //} else { result.ok = 0; result.error = SITE.common.other.fill_socket_error('[se014]', 'Failed to remove activity (DB Error).', rem.err); }
                        } else { result = {...result, id: '[ssara06]', error: rem, text: 'Failed to remove activity - DB Error:'+rem?.message}; }

                    } else { result = {...result, id: '[ssara05]', text: 'Cannot remove activity of different actilog!'}; }

                } else { result = {...result, id: '[ssara04]', error: activity, text: 'Invalid activity or DB error: '+activity?.message}; }

            } else { result = {...result, id: '[ssara03]', text: 'Updating actilog not permitted.'}; }

        } else { result = {...result, id: '[ssara02]', ...auth}; }

    } catch(error) { result = {...result, id: '[ssara01]', error, text: 'Unknown socket [actilog:remove_activity] error: '+error.message}; }

    return result;

};

exports.upsert_project = async function(Q, socket, SITE, data = {}) {
    
    let result  = {ok: 0, data: {}, error: null, id: '', text: ''};

    try {

        var auth = await SITE.actilog.pre.prove_socket_authorization(Q, SITE); // caught in try/catch
        
        if(auth.ok) {

            var actilog_data 	= auth.data;
            var rights 			= auth.data.rights;
            var lang 		 	= data.lang || SITE.config?.languages?.default || 'en';
                lang 		 	= SITE.config.languages.data[lang] ? lang : (SITE.config?.languages?.default || 'en');

            if(rights.write) {

                // INSERT (ADD) PART of UPSERT
                if(data.mode === 'add') {

                    var last_project = await DB.GET(SITE.DB, 'actilog_projects', {order_by: ['id', 'desc', true], limit: 1, format: 'single'}).catch(err=>err);

                    // succesfully got last project
                    if( C.helper.not_error(last_project) && last_project?.id) {

                        // adjust form data
                        var new_project 			= SITE.actilog.validate.project_adjust(data.project);
                            new_project.id 			= last_project.id + 1;
                            new_project.actilog_id 	= Q.safe.actilog_id;
                            new_project.soul_id 	= auth.data.soul_id;

                        // validate project
                        var proofs			= SITE.actilog.validate.project_proofs;
                        let proved			= C.helper.prove.values({data: new_project, proofs, lang});

                        if(proved.ok) {

                            var insert = await DB.SET(SITE.DB, 'actilog_projects', new_project).catch(err=>err);

                            if( C.helper.not_error(insert) ) {

                                result.ok = 1;
                                result.data = {new_project, proved};
                                result.error = null;

                            } else { result = {...result, id: '[ssapu06]', error: insert, text: 'Failed to insert new project - DB Error: '+insert?.message}; }

                        } else { result = {...result, id: '[ssapu05]', errors: proved.errors, text: 'Invalid project data.'}; }

                    } else { result = {...result, id: '[ssapu04]', error: last_project, text: 'Last project not found or failed to get it - DB Error: '+last_project?.message}; }

                // UPDATE (EDIT) PART of UPSERT 
                } else if(data.mode === 'edit') {

                    var db_project = await DB.GET(SITE.DB, 'actilog_projects', {get: data.project_id}).catch(err=>err);

                    // succesfully got project to edit
                    if( C.helper.not_error(db_project) && db_project?.id) {

                        // make sure the project belongs to this actilog, soul is handled in the rights
                        if(db_project.actilog_id === Q.safe?.actilog_id) {

                            // adjust form data
                            var fields_to_update = SITE.actilog.validate.project_adjust(data.project);

                            // validate project
                            var proofs			= SITE.actilog.validate.project_proofs;
                            let proved			= C.helper.prove.values({data: fields_to_update, proofs, lang});

                            if(proved.ok) {

                                // update the project
                                var update = await DB.CHANGE(SITE.DB, 'actilog_projects', {get: db_project.id}, fields_to_update).catch(err=>err);

                                if( C.helper.not_error(update) ) {

                                    result.ok = 1;
                                    result.data = {update, updated_fields: fields_to_update, project_id: db_project.id};
                                    result.error = null;
        
                                } else { result = {...result, id: '[ssapu17]', error: update, text: 'Failed to update project - DB Error: '+update?.message}; }

                            } else { result = {...result, id: '[ssapu16]', errors: proved.errors, text: 'Invalid project data.'}; }

                        } else { result = {...result, id: '[ssapu15]', text: 'Cannot update projects of different actilogs.'}; }

                    } else { result = {...result, id: '[ssapu14]', error: db_project, text: 'Failed to get project ['+data?.project_id+'] to edit - not found or DB Error: '+db_project?.message}; }

                }

            } else { result = {...result, id: '[ssapu03]', text: 'Updating actilog not permitted.'}; }

        } else { result = {...result, id: '[ssapu02]', ...auth}; }

    } catch(error) { result = {...result, id: '[ssapu01]', error, text: 'Unknown socket [actilog:upsert_project] error: '+error.message}; }

    return result;

};

exports.remove_project = async function(Q, socket, SITE, data = {}) {

    let result  = {ok: 0, data: {}, error: null, id: '', text: ''};
    
    try {

        var auth = await SITE.actilog.pre.prove_socket_authorization(Q, SITE);
        
        if(auth.ok) {

            var actilog_data 	= auth.data;
            var rights 			= auth.data.rights;

            if(rights.write) {

                var project_id 		= parseInt(data.data.project) || 0;
                var replacing_id 	= parseInt(data.data.replacing_project) || 0;

                var project 		= await DB.GET(SITE.DB, 'actilog_projects', {get: project_id}).catch(err=>err);
                var rplc_project	= await DB.GET(SITE.DB, 'actilog_projects', {get: replacing_id}).catch(err=>err);

                if(C.helper.not_error(project) && project?.id) {

                    // check if project belongs to actilog
                    if(Q.safe?.actilog_id === project.actilog_id) {

                        // validate replacing project, if its not valid, use default project (id = 0)
                        var r_project = (C.helper.not_error(rplc_project) && rplc_project?.id && rplc_project?.actilog_id === Q.safe?.actilog_id) ? rplc_project : {id: 0};
                            data.data.replacing_project = r_project.id;

                        // update all activities that belong to the project to be removed (update project id to replacing project id)
                        var act_query 	= {project_id: project.id, actilog_id: project.actilog_id, soul_id: project.soul_id};
                        var act_update 	= await DB.CHANGE(SITE.DB, 'actilog_activities', {filter: act_query}, {project_id: r_project.id}).catch(err=>err);
                        
                        if( C.helper.not_error(act_update) ) {

                            // now remove the project
                            var rem 	= await DB.REMOVE(SITE.DB, 'actilog_projects', {get: project.id}).catch(err=>err);

                            if( C.helper.not_error(rem) ) {

                                result.ok           = 1;
                                result.data         = data.data;
                                result.data.remove  = rem;
                                result.error        = null;
        
                            } else { result = {...result, id: '[ssapr07]', error: rem, text:  'Failed to remove project - DB Error: '+rem?.message}; }

                        } else { result = {...result, id: '[ssapr06]', error: act_update, text:  'Failed to move associated activities - DB error: '+act_update?.message}; }

                    } else { result = {...result, id: '[ssapr05]', text: 'Cannot remove project of different actilog!'}; }

                } else { result = {...result, id: '[ssapr04]', error: project, text:  'Project not found or DB error - '+project?.message}; }

            } else { result = {...result, id: '[ssapr03]', text: 'Updating actilog not permitted.'}; }

        } else { result = {...result, id: '[ssapr02]', ...auth}; }

    } catch(error) { result = {...result, id: '[ssapr01]', error, text: 'Unknown socket [actilog:remove_project] error: '+error.message}; }

    return result;

};

// for categories and investors and sources
exports.upsert_item = async function(Q, socket, SITE, data = {}) {
    
    let result  = {ok: 0, data: {}, error: null, id: '', text: ''};

    try {

        var auth = await SITE.actilog.pre.prove_socket_authorization(Q, SITE); // caught in try/catch

        if(auth.ok) {

            var actilog_data 	= auth.data;
            var rights 			= auth.data.rights;
            var sections 		= {categories: 'categories', investors: 'investors', sources: 'sources'}; // allowed sections
            var section 		= sections[data.section] || '';

            if(rights.write) {

                if(section) {

                    var lang 		 	= data.lang || SITE.config?.languages?.default || 'en';
                        lang 		 	= SITE.config.languages.data[lang] ? lang : (SITE.config?.languages?.default || 'en');

                    // INSERT (ADD) PART of UPSERT
                    if(data.mode === 'add') {

                        var last_item 	= await DB.GET(SITE.DB, 'actilog_'+section, {order_by: ['id', 'desc', true], limit: 1, format: 'single'}).catch(err=>err);

                        // succesfully got last item
                        if( C.helper.not_error(last_item) && last_item?.id) {

                            // adjust form data
                            var new_item 				= SITE.actilog.validate[section+'_adjust'](data.item);
                                new_item.id 			= last_item.id + 1;
                                new_item.actilog 		= Q.safe.actilog_id; // !!!!!! categories and investors have item.actilog WHILE projects and activities have item.actilog_id .... the same goes for soul
                                new_item.soul 			= auth.data.soul_id;

                            // validate item
                            var proofs			= SITE.actilog.validate[section+'_proofs'];
                            let proved			= C.helper.prove.values({data: new_item, proofs, lang});

                            if(proved.ok) {

                                var insert = await DB.SET(SITE.DB, 'actilog_'+section, new_item).catch(err=>err);

                                if( C.helper.not_error(insert) ) {

                                    result.ok = 1;
                                    result.data = {new_item, proved};
                                    result.error = null;

                                } else { result = {...result, id: '[ssaiu06]', error: insert, text: 'Failed to insert new item['+section+'] - DB Error: '+insert?.message}; }

                            } else { result = {...result, id: '[ssaiu05]', errors: proved.errors, text: 'Invalid item['+section+'] data.'}; }

                        } else { result = {...result, id: '[ssaiu04]', error: last_item, text: 'Failed to get last item['+section+'] - DB Error: '+last_item?.message}; }

                    // UPDATE (EDIT) PART of UPSERT 
                    } else if(data.mode === 'edit') {

                        var db_item = await DB.GET(SITE.DB, 'actilog_'+section, {get: data.item_id}).catch(err=>err);

                        // succesfully got item to edit
                        if( C.helper.not_error(db_item) && db_item?.id) {

                            // !!!!!! categories and investors have item.actilog WHILE projects and activities have item.actilog_id .... the same goes for soul
                            // make sure the item belongs to this actilog, soul is handled in the rights
                            if(db_item.actilog === Q.safe?.actilog_id) {

                                // adjust form data
                                var fields_to_update = SITE.actilog.validate[section+'_adjust'](data.item);

                                // validate item
                                var proofs			= SITE.actilog.validate[section+'_proofs'];
                                let proved			= C.helper.prove.values({data: fields_to_update, proofs, lang});

                                if(proved.ok) {

                                    // update the item
                                    var update = await DB.CHANGE(SITE.DB, 'actilog_'+section, {get: db_item.id}, fields_to_update).catch(err=>err);

                                    if( C.helper.not_error(update) ) {

                                        result.ok = 1;
                                        result.data = {update, updated_fields: fields_to_update, item_id: db_item.id};
                                        result.error = null;
            
                                    } else { result = {...result, id: '[ssaiu17]', error: update, text: 'Failed to update item['+section+'] - DB Error: '+update?.message}; }

                               } else { result = {...result, id: '[ssaiu16]', errors: proved.errors, text: 'Invalid item['+section+'] data.'}; }

                            } else { result = {...result, id: '[ssaiu15]', text: 'Cannot update item['+section+'] of different actilogs.'}; }

                        } else { result = {...result, id: '[ssaiu14]', error: db_item, text: 'Failed to get item['+section+'] ['+data.item_id+'] to edit - not found or DB Error: '+db_item?.message}; }
                    
                    }

                } else { result = {...result, id: '[ssaiu03]', text: 'Invalid section.'}; }

            } else { result = {...result, id: '[ssaiu03]', text: 'Updating actilog not permitted.'}; }

        } else { result = {...result, id: '[ssaiu02]', ...auth};}

    } catch(error) { result = {...result, id: '[ssaiu01]', error, text: 'Unknown socket [actilog:upsert_item] error: '+error.message}; }

    return result;

};

// for categories and investors and sources
exports.remove_item = async function(Q, socket, SITE, data = {}) {

    let result  = {ok: 0, data: {}, error: null, id: '', text: ''};
    
    try {

        var auth = await SITE.actilog.pre.prove_socket_authorization(Q, SITE);
        
        if(auth.ok) {

            var actilog_data 	= auth.data;
            var rights 			= auth.data.rights;

            if(rights.write) {

                var item_id 	= parseInt(data.data.item) || 0;
                var replacing_id= parseInt(data.data.replacing_item) || 0;
                var singulars	= {categories: 'category', investors: 'investor', sources: 'source'};
                    section 	= singulars[data.data.section] ? data.data.section : 'unknown';
                var singular	= singulars[section];

                var item 		= await DB.GET(SITE.DB, 'actilog_'+section, {get: item_id}).catch(err=>err);
                var rplc_item	= await DB.GET(SITE.DB, 'actilog_'+section, {get: replacing_id}).catch(err=>err);

                if(C.helper.not_error(item) && item.id) {

                    // check if item belongs to actilog
                    if(Q.safe?.actilog_id === item.actilog) {

                        // validate replacing project, if its not valid, use default project (id = 0)
                        var r_item = (C.helper.not_error(rplc_item) && rplc_item.id && rplc_item.actilog === Q.safe?.actilog_id) ? rplc_item : {id: 0};
                            data.data.replacing_item = r_item.id;

                        // update all projects that belong to the item to be removed (update item id to replacing item id)
                        var act_query 				= {actilog_id: item.actilog, soul_id: item.soul};
                            act_query[singular]		= item.id; // act_query['category'] = 2;
                        var new_item_query 			= {};
                            new_item_query[singular]= r_item.id;
                        var act_update 				= await DB.CHANGE(SITE.DB, 'actilog_projects', {filter: act_query}, new_item_query).catch(err=>err);

                        if( act_update && !act_update.DB_ERROR ) {

                            // now remove the project
                            var rem 	= await DB.REMOVE(SITE.DB, 'actilog_'+section, {get: item.id}).catch(err=>err);

                            if( C.helper.not_error(rem) ) {

                                result.ok           = 1;
                                result.data         = data.data;
                                result.data.remove  = rem;
                                result.error        = null;
        
                            } else { result = {...result, id: '[ssair07]', error: rem, text:  'Failed to remove '+singular+' - DB Error: '+rem?.message}; }

                        } else { result = {...result, id: '[ssair06]', error: act_update, text:  'Failed to move associated projects - DB error: '+act_update?.message}; }

                    } else { result = {...result, id: '[ssair05]', text: 'Cannot remove '+singular+' of different actilog!'}; }

                } else { result = {...result, id: '[ssair04]', error: item, text:  'Invalid '+singular+' or DB error - '+item?.message}; }

            } else { result = {...result, id: '[ssair03]', text: 'Updating actilog not permitted.'}; }

        } else { result = {...result, id: '[ssair02]', ...auth}; }

    } catch(error) { result = {...result, id: '[ssair01]', error, text: 'Unknown socket [actilog:remove_item] error: '+error.message}; }

    return result;

};

// for categories and investors and sources
exports.update_setting = async function(Q, socket, SITE, data = {}) {

    let result  = {ok: 0, data: {}, error: null, id: '', text: ''};
    
    try {

        var auth = await SITE.actilog.pre.prove_socket_authorization(Q, SITE);

        if(auth.ok) {

            var actilog_data 	= auth.data;
            var rights 			= auth.data.rights;
            var segments 		= {units: 'units', values: 'values', rights: 'rights', other: 'other'};
            var segment 		= segments[data.segment] || '';
            var lang 		 	= data.lang || SITE.config?.languages?.default || 'en';
                lang 		 	= SITE.config.languages.data[lang] ? lang : (SITE.config?.languages?.default || 'en');

            if(rights.write) {

                if(segment) {

                    var db_settings = await DB.GET(SITE.DB, 'actilog_settings', {filter: {actilog_id: Q.safe.actilog_id}, format: 'single'}).catch(err=>err);
                    var db_actilog 	= await DB.GET(SITE.DB, 'actilog', {get: Q.safe.actilog_id}).catch(err=>err);

                    if( C.helper.not_error(db_settings, db_actilog) && db_settings?.id && db_actilog?.id ) {

                        var db_data_switch 	= {actilog: db_actilog, actilog_settings: db_settings};
                        var table_switch 	= {units: 'actilog_settings', values: 'actilog_settings', other: 'actilog_settings', rights: 'actilog'};
                        var table_to_update = table_switch[segment];
                        var db_data 		= db_data_switch[table_to_update];

                        var data_to_update 	= {};

                        if(segment === 'units' || segment === 'values' || segment === 'other') {

                            var proof = SITE.actilog.validate.settings_proofs[segment][data.field];
                            var proved= proof ? C.helper.prove.value({...proof, value: data.value, lang}) : {ok: 0, value: data.value, error: '[ACTUS] Invalid proof.'};

                            proved.original_value = db_data[segment][data.field];

                            if(proved.ok) {

                                data_to_update[segment] = {};
                                data_to_update[segment][data.field] = proved.value;

                                // update the item
                                var update = await DB.CHANGE(SITE.DB, table_to_update, {filter: {actilog_id: Q.safe.actilog_id}}, data_to_update).catch(err=>err);

                                if( C.helper.not_error(update) ) {

                                    result.ok = 1;
                                    result.data = {update, proved, data};
                                    result.error = null;
        
                                } else { result = {...result, id: '[ssaus08]', error: update, text: 'Failed to update setting ['+segment+':'+data.field+'] - DB Error: '+update?.message}; }

                            } else { result = {...result, id: '[ssaus07]', errors: proved.errors, text: 'Invalid item setting['+segment+'] data.'}; }

                        } else { result = {...result, id: '[ssaus06]', text:  'Unknown segment.' }; }

                    } else { result = {...result, id: '[ssaus05]', error: (db_actilog || db_settings), text:  'Failed to get actilog or its settings ['+Q?.safe?.actilog_id+'] - DB error (actilog): '+db_actilog?.message +'; DB error (actilog_settings): '+ db_settings?.message }; }

                } else { result = {...result, id: '[ssaus04]', text:  'Invalid segment.' }; }

            } else { result = {...result, id: '[ssaus03]', text: 'Updating actilog not permitted.'}; }

        } else { result = {...result, id: '[ssaus02]', ...auth}; }

    } catch(error) { result = {...result, id: '[ssaus01]', error, text: 'Unknown socket [actilog:update_settings] error: '+error.message}; }

    return result;

};

exports.toggle_rights_link = async function(Q, socket, SITE, data = {}) {

    let result  = {ok: 0, data: {}, error: null, id: '', text: ''};
    
    try {

        var auth = await SITE.actilog.pre.prove_socket_authorization(Q, SITE);
        
        if(auth.ok) {

            if(auth.data.is_owner) {

                var types = {read: 'read', write: 'write'};
                var type = types[data.type];

                if(type) {

                    // get full rights
                    var actilog = await DB.GET(SITE.DB, 'actilog', {get: Q.safe?.actilog_id}).catch(err=>err);

                    if(C.helper.not_error(actilog) && actilog.id) {

                        var full_rights = actilog.rights;

                        var current_link= M._.get(full_rights, type+'_limiters.link', '');
                        var new_link	= current_link ? '' : C.helper.random_alpha_numeric(38); // if link set, remove it, if not set, create a new one

                        var data_to_update = {rights: {}};
                            data_to_update.rights[type+'_limiters'] = {link: new_link};

                        var update = await DB.CHANGE(SITE.DB, 'actilog', {get: Q.safe.actilog_id}, data_to_update).catch((err) => Promise.resolve({DB_ERROR: 1, err: err}));

                        if( C.helper.not_error(update) ) {

                            result.ok = 1;
                            result.data = {new_link, update, data};
                            result.error = null;

                        } else { result = {...result, id: '[ssarl06]', error: update, text:  'Failed to update rights link - DB error: '+update?.message}; }

                    } else { result = {...result, id: '[ssarl05]', error: actilog, text:  'Actilog not found or failed to get - DB error: '+actilog?.message}; }

                } else { result = {...result, id: '[ssarl04]', text: 'Invalid rights type.'}; }

            } else { result = {...result, id: '[ssarl03]', text: 'Updating actilog not permitted.'}; }

        } else { result = {...result, id: '[ssarl02]', ...auth}; }

    } catch(error) { result = {...result, id: '[ssarl01]', error, text: 'Unknown socket [actilog:toggle_rights_link] error: '+error.message}; }

    return result;

};

exports.update_rights_souls = async function(Q, socket, SITE, data = {}) {

    let result  = {ok: 0, data: {}, error: null, id: '', text: ''};
    
    try {

        var auth = await SITE.actilog.pre.prove_socket_authorization(Q, SITE);
        
        if(auth.ok) {

            if(auth.data.is_owner) {

                // get full actilog (for replacing)
                var actilog = await DB.GET(SITE.DB, 'actilog', {get: Q.safe?.actilog_id}).catch(err=>err);

                if(C.helper.not_error(actilog) && actilog?.id) {

                    var types 			= {read: 'read', write: 'write'};
                    var type 			= types[data.type];
                        value 			= data.value.substring(0,64); // max 64 chars
                    var souls_regex 	= /[^0-9\,]/g; // allow only digits and commas "15,789,45,145,55,69"
                    var valid 			= !souls_regex.test(value);
                    var errors 			= {cz: 'Neplatný formát (<ID>,<ID>,<ID>)', en: 'Invalid format (<ID>,<ID>,<ID>)', de: 'Ungültiges Format (<ID>,<ID>,<ID>)'}
                    var lang 		 	= data.lang || SITE.config?.languages?.default || 'en';
                        lang 		 	= SITE.config.languages.data[lang] ? lang : (SITE.config?.languages?.default || 'en');
                    var error 			= valid ? '' : (errors[lang] || errors.en);
                        error 			= type ? error : error +'; Invalid type.';

                    if(valid && type) {

                        // get selected souls
                        var soul_ids 		= value.split(',');
                        var proved_soul_ids	= []; 

                        // remove duplicates, parse int etc
                        M._.forEach(soul_ids, function(soul_id) {

                            soul_id = parseInt(soul_id);
                            if(soul_id && (proved_soul_ids.indexOf(soul_id) === -1)) proved_soul_ids.push(soul_id);

                        });

                        var souls 		= await DB.GET(SITE.DB, 'souls', {get: proved_soul_ids}).catch(err=>err);

                        if(C.helper.not_error(souls) && souls) {

                            // loop through valid souls and add them to right_souls field
                            var right_souls = {}; //{id: id, ...}
                            var souls_names = {}; //{id: "<nick>.<ID>", ...}

                            M._.forEach(souls, function(soul) { right_souls[soul.id] = soul.id; souls_names[soul.id] = soul.nick+'.'+soul.id; });

                            // data for replacing
                            var new_actilog = M._.cloneDeep(actilog);
                                new_actilog.rights[type+'_limiters'] = new_actilog.rights[type+'_limiters'] || {};
                                new_actilog.rights[type+'_limiters'].souls = right_souls;
                            var mode 		= 'replace';

                            var update = await DB.CHANGE(SITE.DB, 'actilog', {get: Q.safe?.actilog_id}, new_actilog, mode).catch(err=>err);

                            if( C.helper.not_error(update) ) {

                                result.ok = 1;
                                result.data = {right_souls, souls_names, update, data};
                                result.error = null;

                            } else { result = {...result, id: '[ssars07]', error: update, text:  'Failed to update rights souls - DB error: '+update?.message}; }
    
                        } else { result = {...result, id: '[ssars06]', error: souls, text:  'Failed to get souls - DB error: '+souls?.message}; }

                    } else { result = {...result, id: '[ssars05]', text:  error}; }

                } else { result = {...result, id: '[ssars04]', error: actilog, text:  'Actilog not found or failed to get - DB error: '+actilog?.message}; }

            } else { result = {...result, id: '[ssars03]', text: 'Updating actilog not permitted.'}; }

        } else { result = {...result, id: '[ssars02]', ...auth}; }

    } catch(error) { result = {...result, id: '[ssars01]', error, text: 'Unknown socket [actilog:update_rights_souls] error: '+error.message}; }

    return result;

};

exports.update_rights = async function(Q, socket, SITE, data = {}) {

    let result  = {ok: 0, data: {}, error: null, id: '', text: ''};
    
    try {

        var auth = await SITE.actilog.pre.prove_socket_authorization(Q, SITE);
        
        if(auth.ok) {

            if(auth.data.is_owner) {

                var types 			= {read: 'read', write: 'write'};
                var type 			= types[data.type];
                var rights 			= {public: 'public', limited: 'limited', private: 'private'};
                var right 			= rights[data.value];
                var errors 			= {cz: 'Neplatná hodnota.', en: 'Invalid value.', de: 'Ungültiger Wert.'}
                var lang 		 	= data.lang || SITE.config?.languages?.default || 'en';
                    lang 		 	= SITE.config.languages.data[lang] ? lang : (SITE.config?.languages?.default || 'en');
                var error 			= right ? '' : (errors[lang] || errors.en);

                if(right && type) {

                    // data for replacing
                    var data_to_update = {rights: {}};
                        data_to_update.rights[type] = right;

                    var update = await DB.CHANGE(SITE.DB, 'actilog', {get: Q.safe?.actilog_id}, data_to_update).catch(err=>err);

                    if( C.helper.not_error(update) ) {

                        result.ok = 1;
                        result.data = {data_to_update, update, data};
                        result.error = null;

                    } else { result = {...result, id: '[ssaur05]', error: update, text:  'Failed to update '+type+' rights - DB error: '+update?.message}; }

                } else { result = {...result, id: '[ssaur04]', text: error}; }

            } else { result = {...result, id: '[ssaur03]', text: 'Updating actilog not permitted.'}; }

        } else { result = {...result, id: '[ssaur02]', ...auth};}

    } catch(error) { result = {...result, id: '[ssaur01]', error, text: 'Unknown socket [actilog:update_rights] error: '+error.message}; }

    return result;

};