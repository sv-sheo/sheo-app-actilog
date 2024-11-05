
exports.format_activities = function(data) {

	// data 	 = {activities: {}, projects: {}, categories: {}, investors: {}, sources: {}, settings: {}}
	var activities = {};

	_.forEach(data.activities, function(activity, aid) {

		activities[aid] = S.activities.format_activity({activity, data});

	});

	return activities;

}

exports.format_activity = function({activity, data}) {

	// data 			= {activities: {}, projects: {}, categories: {}, investors: {}, sources: {}, settings: {}}
	var a 				= {...activity};
	var f 				= {};
	var date			= new Date(activity.date);
	var settings 		= data.settings;
	var currency 		= WH.currencies[settings.units.currency];
	var empty_project 	= {name: '----', category: 0, investor: 0, source: 0, expected_hourly_yield: 0, actual_yield: 0, eff_time_spent: 0}; // eff_time_spent is calculated in format_project()
	var project 		= data.projects[a.project_id] || empty_project;
	//var project_formatted= S.projects.format_project({project, data});
	var locale 			= WH.locales_list[localStorage.language] || 'en-GB';

	a.year 		= date.getFullYear();
	a.month 	= date.getMonth() +1;
	a.day 		= date.getDate();
	//f.date 		= a.year+'/'+a.month+'/'+a.day;
	f.date 		= date.toLocaleDateString(locale, {dateStyle: 'medium'});

	f.project 	= project.name;
	f.category 	= _.get(data, ['categories', project.category, 'name'], '----');
	f.investor 	= _.get(data, ['investors', project.investor, 'name'], '----');
	f.source 	= _.get(data, ['sources', project.source, 'name'], '----');

	a.project 	= a.project_id; // dumb me putting project_id as a key in DB
	a.category 	= project.category;
	a.investor 	= project.investor;
	a.source 	= project.source;

	a.efficiency 			= (a.eff_time / a.time);
	a.expected_hourly_yield = project.expected_hourly_yield;
	a.actual_project_yield	= project.actual_yield;

	a.expected_yield 		= (a.eff_time * project.expected_hourly_yield);
	a.actual_yield 			= (project.actual_yield && project.time_spent) ? ( ((project.actual_yield / project.time_spent) * a.time) ) : 0;

	// formatting for table display (units and stuff)
	f.efficiency 		= Math.round(a.efficiency*100) + ' %';
	f.time 				= a.time.toFixed(settings.values.time_spent_decimals)+' '+settings.units.time;
	f.eff_time 			= a.eff_time.toFixed(settings.values.time_spent_decimals)+' '+settings.units.time;

	f.expected_yield 	= parseFloat(a.expected_yield.toFixed(settings.values.price_decimals));
	f.expected_yield 	= M.helpers.format_currency(f.expected_yield, currency.locale, currency.ticker, settings.values.price_decimals);

	f.actual_yield 		= parseFloat(a.actual_yield.toFixed(settings.values.price_decimals));
	f.actual_yield 		= M.helpers.format_currency(f.actual_yield, currency.locale, currency.ticker, settings.values.price_decimals);

	a.f = f;

	return a;

}

exports.format_activity_for_form = function(activity) {

	var state 	= {valid: 0, phase: 'input', errors: []};
	var fields 	= {};
	var to_format = ['date', 'activity', 'description', 'time', 'eff_time', 'efficiency', 'clock'];

	to_format.forEach(function(field) {

		fields[field] = {value: activity[field], valid: false, text: '', error: ''};

	});

	// adjust efficiency
	fields.efficiency.value = parseFloat((fields.efficiency.value*100).toFixed(1));

	// adjust project - in DB the key is "project_id" while in form, its "project"
	fields.project = {value: activity['project_id'], valid: false, text: '', error: ''};

	return {state, fields};

}

exports.handle_upsert_add = function({result, content, l, alert, field_data, set, form, lang}) {

	var new_content 	= _.cloneDeep(content);
	var new_activity 	= result.data.new_activity;
		new_activity 	= S.activities.format_activity({activity: new_activity, data: content});

		new_content.activities[new_activity.id] = new_activity;

	//update activities state
	set.activities(new_content.activities);

	// update bridge
	var bridge_activities = {}; bridge_activities[new_activity.id] = new_activity;
	S.other.bridge_activities(bridge_activities, new_content.projects);

	// recalculate sums of projects, categories, investors, sources
	new_content.projects 	= S.projects.format_projects(new_content);
	new_content.categories 	= S.categories.format_categories(new_content);
	new_content.investors 	= S.investors.format_investors(new_content);
	new_content.sources 	= S.sources.format_sources(new_content);

	set.projects(new_content.projects);
	set.categories(new_content.categories);
	set.investors(new_content.investors);
	set.sources(new_content.sources);

	// switch back to summaries mode (hide add form)
	//set.mode("summaries");

	// leave add mode on, just reset the activity name
	S.handlers.forms.default_change({value: '', input: field_data.activity, field: form.fields.activity, lang, set_form: set.form});
	S.handlers.forms.default_change({value: '', input: field_data.description, field: form.fields.description, lang, set_form: set.form});
	S.handlers.forms.default_change({value: '', input: field_data.clock, field: form.fields.clock, lang, set_form: set.form});


	// create alert
	let new_alert = S.alert.new({type: 'basic', theme: 'success', header: l.item.success+new_activity.activity, text: ''});

	S.alert.create({new_alert, alert, set_alert: set.alert});

}

exports.handle_upsert_edit = function({result, activities, content, l, alert, set}) {

	var new_content 	= _.cloneDeep(content);
	var updated_activity= _.cloneDeep(activities[result.data.activity_id]);
	var wipe 			= true;

		updated_activity = Object.assign(updated_activity, result.data.updated_fields);
		updated_activity = S.activities.format_activity({activity: updated_activity, data: content});

		new_content.activities[updated_activity.id] = updated_activity;
	
	//update projects state
	set.activities(new_content.activities);

	// update bridge
	S.other.bridge_activities(new_content.activities, new_content.projects, wipe);

	// recalculate sums of projects, categories, investors, sources
	new_content.projects 	= S.projects.format_projects(new_content);
	new_content.categories 	= S.categories.format_categories(new_content);
	new_content.investors 	= S.investors.format_investors(new_content);
	new_content.sources 	= S.sources.format_sources(new_content);

	set.projects(new_content.projects);
	set.categories(new_content.categories);
	set.investors(new_content.investors);
	set.sources(new_content.sources);

	set.mode("detail");

	// create alert
	let new_alert = S.alert.new({type: 'basic', theme: 'success', header: l.item.success_edit, text: ''});
	S.alert.create({new_alert, alert, set_alert: set.alert});


}

exports.handle_remove = function({result, activity, content, alert, l, set}) {

	if(result.ok) {

		// remove activity from the bridge
		_.forEach(WH.bridge.activities_by_projects, function(activities_inside, act_id) { delete activities_inside[activity.id]; });
		_.forEach(WH.bridge.activities_by_categories, function(activities_inside, act_id) { delete activities_inside[activity.id]; });
		_.forEach(WH.bridge.activities_by_investors, function(activities_inside, act_id) { delete activities_inside[activity.id]; });
		_.forEach(WH.bridge.activities_by_sources, function(activities_inside, act_id) { delete activities_inside[activity.id]; });

		// remove activity from global state
		var new_content = _.cloneDeep(content);
		delete new_content.activities[activity.id];

		set.activities(new_content.activities);

		// recalculate sums of projects, categories, investors, sources
		new_content.projects 	= S.projects.format_projects(new_content);
		new_content.categories 	= S.categories.format_categories(new_content);
		new_content.investors 	= S.investors.format_investors(new_content);
		new_content.sources 	= S.sources.format_sources(new_content);

		set.projects(new_content.projects);
		set.categories(new_content.categories);
		set.investors(new_content.investors);
		set.sources(new_content.sources);

		// create alert
		let new_alert = S.alert.new({type: 'basic', theme: 'success', header: l.success_remove, text: ''});
		S.alert.create({new_alert, alert, set_alert: set.alert});

	} else { set.result({type: 'error', text: result.id+result.text}); M.log.error({id: '[ACTILOG_REMBTN_01]', message:  'SOCKET RESULT ERROR', result}); }

}

exports.remove_activity = function({item, rights, content, alert, l, set, dummy}) {

	var activity = item;
	var to_send = {activity: activity.id};

	if(rights.write && !dummy) {

		M.socket.execute('ACTILOG', 'actilog_remove_activity', {action: 'actilog_remove_activity', data: to_send}, {return: true})
		.then((socket_result) => {

			set.waiting(0);

			S.activities.handle_remove({result:socket_result, activity, content, alert, l, set});

		}).catch((error) => { set.result({type: 'error', text: error.message}); M.log.error({id: '[ACTILOG_REMBTN_01]', message:'SOCKET ERROR', error}); });

	} else if(dummy) {

		set.waiting(0);
		S.activities.handle_remove({result: {ok: 1, data:{}, error: null}, activity, content, alert, l, set});

	}

}

exports.efficiency_inputs_update_by_time_change = function({form, field_data, time_decimals, lang, set_form}) {
	
	//console.log('TIME HAS BEEN CHANGED');

	let time 			= form.fields.time;
	let eff_time 		= form.fields.eff_time;
	let efficiency 		= form.fields.efficiency;
	let eff_time_value	= time.value * (efficiency.value/100);
		eff_time_value	= parseFloat(eff_time_value.toFixed(time_decimals));

	// update only if its different - to prevent recursion
	if(eff_time.value !== eff_time_value) {

		S.handlers.forms.default_change({value: eff_time_value, input: field_data.eff_time, field: form.fields.eff_time, lang, set_form});

	}

}

exports.efficiency_inputs_update_by_eff_time_change = function({form, field_data, lang, set_form}) {

	//console.log('EFF_TIME HAS BEEN CHANGED');

	let time 			= form.fields.time;
	let eff_time 		= form.fields.eff_time;
	let efficiency 		= form.fields.efficiency;
	let efficiency_val 	= time.value ? ((eff_time.value / time.value)*100) : 0; // cannot divide by zero
		efficiency_val	= parseFloat(efficiency_val.toFixed(1));

	// update only if its different - to prevent recursion
	if(efficiency.value !== efficiency_val) {

		S.handlers.forms.default_change({value: efficiency_val, input: field_data.efficiency, field: form.fields.efficiency, lang, set_form});

	}

}

exports.efficiency_inputs_update_by_efficiency_change = function({form, field_data, time_decimals, lang, set_form}) {

	//console.log('EFFICIENCY HAS BEEN CHANGED');

	let time 			= form.fields.time;
	let eff_time 		= form.fields.eff_time;
	let efficiency 		= form.fields.efficiency;
	let eff_val_valid 	= M.helpers.to_range({number: efficiency.value, decimals: 1, min: 0, max: 100}); 
	let eff_time_value	= time.value * (efficiency.value/100);
		eff_time_value	= parseFloat(eff_time_value.toFixed(time_decimals));
	let closest_integer = Math.round(eff_time_value);
	let remainder 		= Math.abs(closest_integer - eff_time_value);

	// when dealing with thirds, round numbers like "8,05 -> 8" or "7,95 -> 8" (if the remainder till whole number is smaller than 0,05)
	if(remainder < 0.05) eff_time_value = closest_integer;

	// in case of efficiency not being valid, change the value of efficency to be valid first
	if(efficiency.value !== eff_val_valid) {

		S.handlers.forms.default_change({value: eff_val_valid, input: field_data.efficiency, field: form.fields.efficiency, lang, set_form});

	// efficiency is valid, proceed with updating eff_time
	} else {

		// update only if its different - to prevent recursion
		if(eff_time.value !== eff_time_value) {

			S.handlers.forms.default_change({value: eff_time_value, input: field_data.eff_time, field: form.fields.eff_time, lang, set_form});

		}

	}

}

exports.dummy_upsert = function({p, content, activities, l, alert, set, field_data, form, lang, to_send}) {

	if(p.mode === 'add') {
		
		var result = {data: {new_activity: S.activities.activity_adjust(to_send.activity, content.settings)}};

		S.activities.handle_upsert_add({result, content, l, alert, field_data, set, form, lang});

	}

	if(p.mode === 'edit') {

			to_send.activity.id = to_send.activity_id;
		var result = {data: {updated_fields: S.activities.activity_adjust(to_send.activity, content.settings), activity_id: to_send.activity_id}};
		
		S.activities.handle_upsert_edit({result, activities, content, l, alert, set});

	}

}

exports.activity_adjust = function(activity, settings) {

	var now 				= new Date();
	var time_decimals 		= _.get(settings, 'values.time_spent_decimals', 0);
	var fields 				= {};
		fields.date 		= parseInt(activity.date) || 0;
		fields.project_id 	= parseInt(activity.project) || 0;
		fields.activity		= activity.activity || '';
		fields.description 	= activity.description || '';
		fields.clock 		= activity.clock || '';

		// adjusting time formats, eff_time cannot be bigger than time
		fields.time 		= parseFloat(activity.time) || 0;
		fields.time 		= parseFloat(fields.time.toFixed(time_decimals)) || 0;
		fields.eff_time 	= parseFloat(activity.eff_time) || 0;
		fields.eff_time 	= (fields.eff_time > fields.time) ? fields.time : fields.eff_time;
		fields.eff_time 	= parseFloat(fields.eff_time.toFixed(time_decimals)) || 0;

		fields.id 			= activity.id || now.getTime();
		fields.actilog_id 	= parseInt(WH.actilog_id);
		fields.soul_id 		= WH.soul.id || 0;

	return fields;

}