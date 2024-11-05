
// common for categories + investors

exports.handle_upsert_add = function({result, items, set_items, section, content, set_mode, l, alert, set_alert}) {

	var singular 	= WH.singulars.sections[section] || 'unknown';
	var new_items 	= {...items};
	var new_item	= result.data.new_item;
		new_item 	= S[section]['format_'+singular](new_item, content); // i.e. S.categories.format_category(...)

		new_items[new_item.id] = new_item;

	//update items state
	set_items(new_items);

	// update bridge - not needed for new investors/categories (without any activities nor projects)

	// switch back to summaries mode (hide add form)
	set_mode("summaries");

	// create alert
	let new_alert = S.alert.new({type: 'basic', theme: 'success', header: l.item.success+new_item.name, text: ''});

	S.alert.create({new_alert, alert, set_alert});

}

exports.handle_upsert_edit = function({result, items, set_items, section, content, set_mode, l, alert, set_alert}) {

	var singular 	= WH.singulars.sections[section] || 'unknown';
	var new_items 	= {...items};
	var updated_item = _.cloneDeep(items[result.data.item_id]);
		
		updated_item = Object.assign(updated_item, result.data.updated_fields);
		updated_item = S[section]['format_'+singular](updated_item, content); // i.e. S.categories.format_category(...)

		new_items[updated_item.id] = updated_item;
	
	//update items state
	set_items(new_items);

	// update bridge - not needed for new investors/categories (without any activities nor projects)

	set_mode("detail");

	var random_bool = Math.round(Math.random());
	var ac = random_bool ? 'open' : 'queue';
	var ac = 'open';

	// create alert
	let new_alert = S.alert.new({type: 'basic', theme: 'success', action: ac, header: l.item.success_edit, text: ''});
		S.alert.create({new_alert, alert, set_alert});


}

exports.handle_remove = function({result, item, content, alert, l, set, singular, section}) {

	if(result.ok) {

		var new_content 	= _.cloneDeep(content);
		var replacement_ 	= result.data.replacing_item; // replacing item was set to 0 if it was found invalid in the backend

		// move projects of the removed item to the replacing item
		_.forEach(WH.bridge['projects_by_'+section], function(projects_in_c, inv_id) { 

			if(parseInt(inv_id) === item.id) {

				var projects_in_replaced_item = WH.bridge['projects_by_'+section][replacement_] || {};
				var projects_in_removed_item_ = WH.bridge['projects_by_'+section][inv_id] || {};
				var projects_in_removed_item = _.cloneDeep(projects_in_removed_item_);
				WH.bridge['projects_by_'+section][replacement_] = {...projects_in_replaced_item, ...projects_in_removed_item};
				delete WH.bridge['projects_by_'+section][inv_id];

				// update new item_id in each project in content
				_.forEach(projects_in_removed_item, function(prj_id) { 
					
					if(new_content.projects[prj_id]) new_content.projects[prj_id][singular] = replacement_; // new_content.projects[1].category = 5
				
				});

			}
		
		});

		// move activities of the removed item to the replacing item
		_.forEach(WH.bridge['activities_by_'+section], function(activities_in_c, inv_id) { 

			if(parseInt(inv_id) === item.id) {

				var activities_in_replaced_item = WH.bridge['activities_by_'+section][replacement_] || {};
				var activities_in_removed_item_ = WH.bridge['activities_by_'+section][inv_id] || {};
				var activities_in_removed_item = _.cloneDeep(activities_in_removed_item_);
				WH.bridge['activities_by_'+section][replacement_] = {...activities_in_replaced_item, ...activities_in_removed_item};
				delete WH.bridge['activities_by_'+section][inv_id];

			}
		
		});

		delete new_content[section][item.id];

		// recalculate sums of projects
		new_content.projects 	= S.projects.format_projects(new_content);
		set.projects(new_content.projects);

		// update items in activities
		new_content.activities 	= S.activities.format_activities(new_content);
		set.activities(new_content.activities);

		// format new items twice (before and after updating projects and activities)
		new_content[section] = S[section]['format_'+section](new_content);
		set.items(new_content[section]);

		// create alert
		let new_alert = S.alert.new({type: 'basic', theme: 'success', header: l.success_remove, text: ''});
		S.alert.create({new_alert, alert, set_alert: set.alert});

	} else { set.result({type: 'error', text: result.id+' '+result.text}); M.log.error({id: '[ACTILOG_IREMBTN_01]', message:  'SOCKET RESULT ERROR', result}); }

}

exports.remove_item = function({item, replacement, rights, section, content, alert, l, set, dummy}) {

	var singular 	= WH.singulars.sections[section] || 'unknown';
	var to_send 	= {item: item.id, replacing_item: replacement, section };
		set.items 	= set[section] || function() { set.result({type: 'error', text: '[RMBTN_IT1] Invalid set_items method.'}); M.log.error({id: '[RMBTN_IT1]', message:'Invalid set_items method.', error: new Error('Invalid set_items method.')}); };

	if(rights.write && !dummy) {

		M.socket.execute('ACTILOG', 'actilog_remove_item', {action: 'actilog_remove_item', data: to_send}, {return: true})
		.then((socket_result) => {

			set.waiting(0);
			S.items.handle_remove({result: socket_result, item, content, alert, l, set, singular, section})

		}).catch((error) => { set.result({type: 'error', text: error.message}); M.log.error({id: '[ACTILOG_IREMBTN_01]', message:'SOCKET ERROR', error}); });

	} else if(dummy) {

		set.waiting(0);
		S.items.handle_remove({result: {ok: 1, data:to_send, error: null}, item, content, alert, l, set, singular, section});

	}

}

exports.dummy_upsert = function({p, content, items, l, alert, set_alert, set_items, form, lang, to_send, set_mode, section}) {

	if(p.mode === 'add') {
		
		var result = {data: {new_item: S.items.item_adjust(to_send.item, section)}};

		S.items.handle_upsert_add({result, items, set_items, content, l, alert, set_mode, set_alert, form, lang, section});

	}

	if(p.mode === 'edit') {

			to_send.item.id = to_send.item_id;
		var result = {data: {updated_fields: S.items.item_adjust(to_send.item, section), item_id: to_send.item_id}};
		
		S.items.handle_upsert_edit({result, items, set_items, content, l, alert, set_mode, set_alert, form, lang, section});

	}

}

exports.item_adjust = function(item, section) {

	var now = new Date();
	var fields = {};

	if(section === 'categories') {

		fields.name 		= item.name || '';
	}

	if(section === 'investors') {

		fields.name 		= item.name || '';
		fields.address 		= item.address || '';
		fields.email		= item.email || '';
		fields.phone 		= item.phone || '';
	}


	if(section === 'sources') {

		fields.name 		= item.name || '';
	}

	fields.id 				= item.id || now.getTime();
	fields.actilog 			= parseInt(WH.actilog_id);
	fields.soul 			= WH.soul.id || 0;

	return fields;

}