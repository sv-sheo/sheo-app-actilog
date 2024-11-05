
// enable async (require babel core polyfill packages)
//require("core-js/stable");
//require("regenerator-runtime/runtime");

exports.menu_links 	= require('./menu_links');
exports.filter 		= require('./filter');
exports.reducers 	= require('./reducers');
exports.validation	= require('./validation');
exports.forms		= require('./forms');
exports.charts		= require('./charts');

exports.setup_initial_state = function() {

	// STATE MANAGEMENT DONE BY jotai ... https://github.com/pmndrs/jotai
	return new Promise(function(resolve, reject) {

		let atom		= J.atom;
		let defaults 	= {};

			defaults.alert 				= {active: null, alerts: {}, queue: [], close_timeout: 0}; // example: {active: {id: 1, ...}, alerts: {2: {id: 2, ...}}, queue: [2]};
			defaults.section 			= WH.sections['activities'];
			defaults.filter				= _.cloneDeep(WH.default_filter);
			defaults.filtered			= {activities: [], projects: [], categories: [], investors: [], sources: []}; // must be array (filter result)
			defaults.summaries 			= _.cloneDeep(WH.default_summaries);
			defaults.dummy 				= (parseInt(WH.actilog_id) === 1) ? true : false;

		A.language 		= atom(WH.language);				// cz | en | de
		A.phase			= atom('loading'); 					// loading | forbidden | access
		A.rights 		= atom({read: false, write: false});
		A.is_owner 		= atom(false);						// bool
		A.alert 		= atom(defaults.alert);				// by default no alert, however an alert will show on load if alerts_queue is not empty
		A.dummy 		= atom(defaults.dummy);				// if true, do not send changes to the server, keep everything local

		A.section 		= atom(defaults.section);			// possible options: activities, projects, categories, investors, sources, settings
		A.activities 	= atom({});
		A.projects 		= atom({});
		A.categories 	= atom({});
		A.investors 	= atom({});
		A.sources 		= atom({});
		A.settings 		= atom({});
		A.filter 		= atom(defaults.filter);
		A.filtered 		= atom(defaults.filtered);
		A.summaries 	= atom(defaults.summaries);

		resolve('SETUP INITIAL STATE');

	});

}


exports.bridge_data = function(data) {

	S.other.bridge_activities(data.activities, data.projects);

	S.other.bridge_projects(data.projects);

}

exports.bridge_activities = function(activities, projects, wipe) {

	if(wipe) {

		WH.bridge.activities_by_projects	= {};
		WH.bridge.activities_by_categories	= {};
		WH.bridge.activities_by_investors	= {};
		WH.bridge.activities_by_sources		= {};

	}

	_.forEach(activities, function(activity, a_id) {

		let project_id 	= activity.project_id;
		let project_ 	= projects[project_id] || {}; 
		let category_id = project_.category || 0;
		let investor_id = project_.investor || 0;
		let source_id 	= project_.source || 0;

		WH.bridge.activities_by_projects[project_id] 					= WH.bridge.activities_by_projects[project_id] || {};
		WH.bridge.activities_by_projects[project_id][activity.id] 		= activity.id;

		WH.bridge.activities_by_categories[category_id] 				= WH.bridge.activities_by_categories[category_id] || {};
		WH.bridge.activities_by_categories[category_id][activity.id] 	= activity.id;

		WH.bridge.activities_by_investors[investor_id] 					= WH.bridge.activities_by_investors[investor_id] || {};
		WH.bridge.activities_by_investors[investor_id][activity.id] 	= activity.id;

		WH.bridge.activities_by_sources[source_id] 						= WH.bridge.activities_by_sources[source_id] || {};
		WH.bridge.activities_by_sources[source_id][activity.id] 		= activity.id;

	});

}

exports.bridge_projects = function(projects, wipe) {

	if(wipe) {

		WH.bridge.projects_by_categories	= {};
		WH.bridge.projects_by_investors		= {};
		WH.bridge.projects_by_sources		= {};

	}

	_.forEach(projects, function(project, p_id) {

		WH.bridge.projects_by_categories[project.category] 				= WH.bridge.projects_by_categories[project.category] || {};
		WH.bridge.projects_by_categories[project.category][project.id] 	= project.id;

		WH.bridge.projects_by_investors[project.investor] 				= WH.bridge.projects_by_investors[project.investor] || {};
		WH.bridge.projects_by_investors[project.investor][project.id] 	= project.id;

		WH.bridge.projects_by_sources[project.source] 					= WH.bridge.projects_by_sources[project.source] || {};
		WH.bridge.projects_by_sources[project.source][project.id] 		= project.id;

	});

}

exports.get_checkbox_image = function(icon, class_) {

	var src = WH.HOST+'/files/get/icons/'+icon+'?v='+WH.resource_version;

	return (<img src={src} className={class_} />);

}

exports.populate_WH = function() {

	var w = {};

	w.currencies   	= PRELOAD_DATA.currencies;
	w.languages    	= PRELOAD_DATA.languages;
	w.language     	= localStorage.language || PRELOAD_DATA.language;
	w.request_id   	= PRELOAD_DATA.request_id;
	w.actilog_id   	= PRELOAD_DATA.actilog_id;
	w.HOST         	= PRELOAD_DATA.HOST;
	w.site_host 	= PRELOAD_DATA.site_host;
	w.soul         	= PRELOAD_DATA.soul;
	w.alerts        = PRELOAD_DATA.alerts;

	w.locales 		= require('./locales');
	w.locales_list 	= {cz: 'cs-CZ', en: 'en-US', de: 'de-DE'};

	w.other        	= w.other || {};

	w.sections 		= {activities: 'activities', projects: 'projects', categories: 'categories', investors: 'investors', sources: 'sources', settings: 'settings'}

	w.APP_URL 		= "/"+w.actilog_id;

	w.bridge 		= { // filled in hooks/fetch/actilog_data

		activities_by_projects: {},	// {project_id: {a_id: a_id, a_id: a_id, a_id: a_id, ...}, project_id: {}}
		activities_by_categories: {},
		activities_by_investors: {},
		activities_by_sources: {},
		projects_by_categories: {},
		projects_by_investors: {},
		projects_by_sources: {}

	}

	w.resource_version = PRELOAD_DATA.resource_version;

	w.default_filter				= {activities: {}, projects: {}, categories: {}, investors: {}, __ORDER_BY: {} };
	w.default_filter.activities 	= {activity: '', date_from: '', date_to: '', project: '', category: '', investor: '', source: ''};
	w.default_filter.projects 		= {name: '', date_from: '', date_to: '', n: '', category: '', investor: '', source: '', paid: '', finished: ''};
	w.default_filter.categories 	= {name: ''};
	w.default_filter.investors 		= {name: '', address: ''};
	w.default_filter.sources 		= {name: ''};
	w.default_filter.settings 		= {name: '', year: '', n: '', category: '', investor: '', paid: '', finished: ''};

	var default_order_by 			= {column: '', direction: ''};
 
	w.default_filter.__ORDER_BY 	= {activities: {...default_order_by}, projects: {...default_order_by}, categories: {...default_order_by}, investors: {...default_order_by}};

	w.default_summaries 			= {	activities: {time: 0, eff_time: 0, efficiency: 0, expected_yield: 0, actual_yield: 0}, 
										projects: 	{time_spent: 0, eff_time_spent: 0, efficiency: 0, expected_yield: 0, actual_yield: 0},
										categories: {time_spent: 0, eff_time_spent: 0, efficiency: 0, expected_yield: 0, actual_yield: 0},
										investors: 	{time_spent: 0, eff_time_spent: 0, efficiency: 0, expected_yield: 0, actual_yield: 0},
										sources: 	{time_spent: 0, eff_time_spent: 0, efficiency: 0, expected_yield: 0, actual_yield: 0}
									};

	w.charts 						= { sections: {
		
											activities: { items: {monthly_yield_time: 1, daily_yield_time: 1, time_by_categories: 0, time_by_investors: 0, time_by_sources: 0}, },
											projects: 	{ items: {time_by_categories: 0, time_by_investors: 0, time_by_sources: 0},},
											categories: { items: {time_by_categories: 0, },},
											investors: 	{ items: {time_by_investors: 0, },},
											sources: 	{ items: {time_by_sources: 0, },},
											settings: 	{ items: {},}
											
										},

										items: {

											monthly_yield_time: 	{ type: 'monthly_time_overview', width: {units: '%', value: 100}, height: {units: 'px', value: 300} },
											daily_yield_time: 		{ type: 'line_biaxial', width: {units: '%', value: 100}, height: {units: 'px', value: 330} },
											time_by_categories: 	{ type: 'pie',			width: {units: 'px', value: 300}, height: {units: 'px', value: 300}},
											time_by_investors: 		{ type: 'pie', 			width: {units: 'px', value: 300}, height: {units: 'px', value: 300}},
											time_by_sources: 		{ type: 'pie', 			width: {units: 'px', value: 300}, height: {units: 'px', value: 300}},

										}

									};

	w.defaults 						= {};

	w.defaults.activity 			= { date: {}, project: {}, activity: {}, time: {}, eff_time: {}, efficiency: {}, description: {}, clock: {}}; // insides of a field should look like this: {value, valid: bool, text: '',error: ''}
	w.defaults.activity_form 		= { state: {valid: 0, phase: 'input', errors: []}, fields: {...w.defaults.activity} };

	w.defaults.project 				= { n: {}, name: {}, description: {}, date: {}, category: {}, investor: {}, source: {}, expected_hourly_yield: {}, actual_yield: {}, paid: {}, finished: {} }; // insides of a field should look like this: {value, valid: bool, text: '',error: ''}
	w.defaults.project_form 		= { state: {valid: 0, phase: 'input', errors: []}, fields: {...w.defaults.project} };

	w.defaults.category 			= { name: {}};
	w.defaults.category_form 		= { state: {valid: 0, phase: 'input', errors: []}, fields: {...w.defaults.category} };

	w.defaults.investor 			= { name: {}, address: {}, email: {}, phone: {}};
	w.defaults.investor_form 		= { state: {valid: 0, phase: 'input', errors: []}, fields: {...w.defaults.investor} };

	w.defaults.source 				= { name: {}};
	w.defaults.source_form 			= { state: {valid: 0, phase: 'input', errors: []}, fields: {...w.defaults.source} };

	w.singulars 					= {};
	w.singulars.sections 			= {activities: 'activity', projects: 'project', categories: 'category', investors: 'investor', sources: 'source'};

	return w;

}

// calculate avergay expected hourly yields for category/investor (weighted average)
exports.calculate_average_ehy = function(data) {

	var activities_sum = 0; // count of activities across projects
	var ehy_sum = 0; // sum of ehy*(count of activities in a project) of each project

	_.forEach(data, function(project_ehy, p_id) {

		let p_activities_sum= project_ehy.activities.length;
		let project_ehy_sum	= project_ehy.ehy * p_activities_sum;

		activities_sum 		+= p_activities_sum;
		ehy_sum 			+= project_ehy_sum;

	});

	var average_ehy = (activities_sum > 0) ? (ehy_sum / activities_sum) : 0;

	return average_ehy;

}

exports.ready = new Promise((resolve, reject) => {
    
    document.onreadystatechange = function() {

        if(document.readyState === 'interactive') {
         
            M.log.time('DOM loaded.');

			var PD = PRELOAD_DATA || {}; // should be in HTML

			// get language
			var language    = PRELOAD_DATA.language ? PRELOAD_DATA.language : 'en';
				language    = {cz: 1, en: 1, de: 1}[language] ? language : 'en';
			var texts       = {

				cz: {header: 'NAČÍTÁM'},
				en: {header: 'LOADING'},
				de: {header: 'WIRD GELADEN'},

			}

			var t = texts[language];

			resolve(); // script declaring in html

            // add LOADING status to no_javascript
         /*   var DOM_nj_header           = document.getElementById('no_javascript_scroll_header');
            var DOM_nj_text             = document.getElementById('no_javascript_scroll_text');
                DOM_nj_header.innerHTML = t.header;
                DOM_nj_text.innerHTML   = '<div class="tc pd50_0"><img src="'+SERVER_DATA.HOST+'files/get/icons/loader2.gif" width="40" height="40" ></div>';
*/


			// get language
			/*var languages 	= {cz: 1, en: 1, de: 1};
			var language    = WH.language || PD.language || navigator.language || 'en';
				language 	= language.split('-')[0]; // some browsers return 'en-GB' format of language
				language    = languages[language] ? language : 'en';

			var texts       = { cz: {header: 'NAČÍTÁM'}, en: {header: 'LOADING'}, de: {header: 'WIRD GELADEN'}, }

            // add LOADING status to no_javascript
         	var DOM_nj_header           = document.getElementById('no_js_header');
            var DOM_nj_text             = document.getElementById('no_js_text');
                DOM_nj_header.innerHTML = texts[language].header;
                DOM_nj_text.innerHTML   = '<div class="tc"><img src="'+PD.HOST+'/files/get/actilog/icons/loading.gif" width="40" height="40" ></div>';

            resolve(); // script declaring in html*/
            
        }
        
        if(document.readyState === 'complete') {
         
            M.log.time('PAGE loaded. (synchronous JS, CSS, IMAGES)');
            
        }
        
    };
    
});