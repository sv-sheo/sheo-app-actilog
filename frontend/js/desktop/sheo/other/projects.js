
exports.format_projects = function(data) {

	// data 	 = {activities: {}, projects: {}, categories: {}, investors: {}, sources: {}, settings: {}}
	var projects = {};

	_.forEach(data.projects, function(project, pid) {

		projects[pid] = S.projects.format_project({project, data});

	});

	return projects;

}

exports.format_project = function({project, data}) {

	// data 			= {activities: {}, projects: {}, categories: {}, investors: {}, sources: {}, settings: {}}
	var p 				= {...project};
	var f 				= {};
	var date			= new Date(project.date);
	var settings 		= data.settings;
	var activity_ids	= WH.bridge.activities_by_projects[project.id] || {};
	var currency 		= WH.currencies[settings.units.currency];
	var locale 			= WH.locales_list[localStorage.language] || 'en-GB';

	p.year 	= date.getFullYear();
	p.month = date.getMonth() +1;
	p.day 	= date.getDate();
	f.date 	= date.toLocaleDateString(locale, {dateStyle: 'medium'});

	p.category_name = _.get(data, ['categories', project.category, 'name'], '----');
	p.investor_name = _.get(data, ['investors', project.investor, 'name'], '----');
	p.source_name 	= _.get(data, ['sources', project.source, 'name'], '----');

	p.activities_count 	= 0;
	p.time_spent 		= 0;
	p.eff_time_spent	= 0;
	var efficiency_sum	= 0;

	_.forEach(activity_ids, function(a_id_, a_id) {

		let a = data.activities[a_id];

		p.activities_count 	+= 1;
		p.time_spent 		+= a.time;
		p.eff_time_spent 	+= a.eff_time;
		efficiency_sum 		+= (a.eff_time / a.time);

	});

	p.efficiency		= (p.activities_count > 0) ? (efficiency_sum / p.activities_count) : 0; // average efficiency
	p.expected_yield 	= (p.eff_time_spent * p.expected_hourly_yield);
	//p.expected_yield 	= new Intl.NumberFormat('cs-cz', { style: 'currency', currency: 'CZK' }).format(123456.789);

	// formatting for table display (units and stuff)
	f.efficiency 		= Math.round(p.efficiency*100) + ' %';
	f.time_spent 		= p.time_spent.toFixed(settings.values.time_spent_decimals)+' '+settings.units.time;
	f.eff_time_spent 	= p.eff_time_spent.toFixed(settings.values.time_spent_decimals)+' '+settings.units.time;

	f.expected_yield 	= parseFloat(p.expected_yield.toFixed(settings.values.price_decimals));
	f.expected_yield 	= M.helpers.format_currency(f.expected_yield, currency.locale, currency.ticker, settings.values.price_decimals);

	f.actual_yield 		= parseFloat(p.actual_yield.toFixed(settings.values.price_decimals));
	f.actual_yield 		= M.helpers.format_currency(f.actual_yield, currency.locale, currency.ticker, settings.values.price_decimals);

	f.paid 				= S.other.get_checkbox_image((p.paid ? 'check1_green.png' : 'cancel1_red.png'), 'row_icon');
	f.finished 			= S.other.get_checkbox_image((p.finished ? 'check1_green.png' : 'cancel1_red.png'), 'row_icon');

	p.f = f;

	return p;

}

exports.format_project_for_form = function(project) {

	var state 	= {valid: 0, phase: 'input', errors: []};
	var fields 	= {};
	var to_format = ['n', 'date', 'name', 'description', 'category', 'investor', 'source', 'expected_hourly_yield', 'actual_yield', 'paid', 'finished'];

	to_format.forEach(function(field) {

		fields[field] = {value: project[field], valid: false, text: '', error: ''};

	})

	return {state, fields};

}

exports.handle_upsert_add = function({result, content, l, alert, set}) {

	var new_content 	= _.cloneDeep(content);
	var new_project 	= result.data.new_project;
		new_project 	= S.projects.format_project({project: new_project, data: content});

		new_content.projects[new_project.id] = new_project;

	//update projects state
	set.projects(new_content.projects);

	// update bridge
	var bridge_project 	= {}; bridge_project[new_project.id] = new_project;
	S.other.bridge_data({activities: {}, projects: bridge_project});

	// recalculate sums of categories, investors, sources
	new_content.categories 	= S.categories.format_categories(new_content);
	new_content.investors 	= S.investors.format_investors(new_content);
	new_content.sources 	= S.sources.format_sources(new_content);

	set.categories(new_content.categories);
	set.investors(new_content.investors);
	set.sources(new_content.sources);

	// switch back to summaries mode (hide add form)
	set.mode("summaries");

	// create alert
	let new_alert = S.alert.new({type: 'basic', theme: 'success', header: l.item.success+new_project.name, text: ''});

	S.alert.create({new_alert, alert, set_alert: set.alert});

}

exports.handle_upsert_edit = function({result, projects, content, l, alert, set}) {

	var new_content 	= _.cloneDeep(content);
	var updated_project = _.cloneDeep(projects[result.data.project_id]);
	var wipe 			= true;
		
		updated_project = Object.assign(updated_project, result.data.updated_fields);
		updated_project = S.projects.format_project({project: updated_project, data: content});

		new_content.projects[updated_project.id] = updated_project;
	
	//update projects state
	set.projects(new_content.projects);

	// update bridge
	S.other.bridge_projects(new_content.projects, wipe);
	S.other.bridge_activities(new_content.activities, new_content.projects, wipe);

	// recalculate sums of categories, investors, sources
	new_content.activities 	= S.activities.format_activities(new_content);
	new_content.categories 	= S.categories.format_categories(new_content);
	new_content.investors 	= S.investors.format_investors(new_content);
	new_content.sources 	= S.sources.format_sources(new_content);

	set.activities(new_content.activities);
	set.categories(new_content.categories);
	set.investors(new_content.investors);
	set.sources(new_content.sources);

	set.mode("detail");

	// create alert
	let new_alert = S.alert.new({type: 'basic', theme: 'success', header: l.item.success_edit, text: ''});
	S.alert.create({new_alert, alert, set_alert: set.alert});


}

exports.handle_remove = function({result, project, content, alert, l, set}) {

	if(result.ok) {

		var replacement_ 		= result.data.replacing_project; // replacing category was set to 1 if it was found invalid in the backend
		var new_content 		= _.cloneDeep(content);
		var wipe 				= true;

		// move activities to replacing project
		_.forEach(WH.bridge.activities_by_projects, function(activities_in_project, project_id) {

			if(parseInt(project_id) === project.id) {

				var aiptbr= _.cloneDeep(activities_in_project); // activities in project to be removed

				// update project_id in affected activities
				_.forEach(aiptbr, function(aact_id) {

					new_content.activities[aact_id].project_id = replacement_;

					//console.log('LLLLLL', 'REWRITING project_id OF ACTIVITY ['+aact_id+'] FROM ('+project_id+') to ('+replacement_+')');

				});

			}

		});

		// remove project from global state and update replacing project - add activtities to its formatted data (if it exists)
		delete new_content.projects[project.id];
		if(new_content.projects[replacement_]) new_content.projects[replacement_] = S.projects.format_project({project: new_content.projects[replacement_], data: new_content});

		new_content.activities	= S.activities.format_activities(new_content);
		set.activities(new_content.activities);

		// update bridge
		S.other.bridge_projects(new_content.projects, wipe);
		S.other.bridge_activities(new_content.activities, new_content.projects, wipe);

		new_content.projects	= S.projects.format_projects(new_content); // projects need to be formatted twice
		set.projects(new_content.projects);

		// recalculate sums of categories and investor
		new_content.categories = S.categories.format_categories(new_content);
		new_content.investors = S.investors.format_investors(new_content);
		new_content.sources = S.sources.format_sources(new_content);

		set.categories(new_content.categories);
		set.investors(new_content.investors);
		set.sources(new_content.sources);

		// create alert
		let new_alert = S.alert.new({type: 'basic', theme: 'success', header: l.success_remove, text: ''});
		S.alert.create({new_alert, alert, set_alert: set.alert});

	} else { set.result({type: 'error', text: result.id+' '+result.text}); M.log.error({id: '[ACTILOG_REMBTNP_01]', message:  'SOCKET RESULT ERROR', result}); }

}

exports.remove_project = function({item, replacement, rights, content, alert, l, set, dummy}) {

	var project = item;
	var to_send = {project: project.id, replacing_project: replacement };

	if(rights.write && !dummy) {

		M.socket.execute('ACTILOG', 'actilog_remove_project', {action: 'actilog_remove_project', data: to_send}, {return: true})
		.then((socket_result) => {

			set.waiting(0);

			S.projects.handle_remove({result:socket_result, project, content, alert, l, set})

		}).catch((error) => { set.result({type: 'error', text: error.message}); M.log.error({id: '[ACTILOG_REMBTNP_01]', message:'SOCKET ERROR', error}); });

	} else if(dummy) {

		set.waiting(0);
		S.projects.handle_remove({result: {ok: 1, data:to_send, error: null}, project, content, alert, l, set});

	}

}

exports.dummy_upsert = function({p, content, projects, l, alert, set, field_data, form, lang, to_send}) {

	if(p.mode === 'add') {
		
		var result = {data: {new_project: S.projects.project_adjust(to_send.project, content)}};

		S.projects.handle_upsert_add({result, content, l, alert, field_data, set, form, lang});

	}

	if(p.mode === 'edit') {

			to_send.project.id = to_send.project_id;
		var result = {data: {updated_fields: S.projects.project_adjust(to_send.project), project_id: to_send.project_id}};
		
		S.projects.handle_upsert_edit({result, projects, content, l, alert, set});

	}

}

exports.project_adjust = function(project) {

	var now 				= new Date();
	var fields 				= {};
		fields.n 			= parseInt(project.n) || 0;
		fields.date 		= parseInt(project.date) || 0;
		fields.category 	= parseInt(project.category) || 0;
		fields.investor 	= parseInt(project.investor) || 0;
		fields.source 		= parseInt(project.source) || 0;

		fields.name 		= project.name || '';
		fields.description 	= project.description || '';

		fields.expected_hourly_yield	= parseInt(project.expected_hourly_yield) || 0;
		fields.actual_yield				= parseInt(project.actual_yield) || 0;
		fields.paid						= project.paid ? now.getTime() : false;
		fields.finished					= project.finished ? now.getTime() : false;

		fields.id 			= project.id || now.getTime();
		fields.actilog_id 	= parseInt(WH.actilog_id);
		fields.soul_id 		= WH.soul.id || 0;

	return fields;

}