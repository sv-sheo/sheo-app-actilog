
// runs only ONCE, on init of root.jsx
//function actilog_data({alert, set_alert}) {
function actilog_data() {

	const [phase, set_phase] 				= J.useAtom(A.phase);
	const [rights, set_rights] 				= J.useAtom(A.rights);
	const [dummy, set_dummy] 				= J.useAtom(A.dummy);
	const [is_owner, set_is_owner] 			= J.useAtom(A.is_owner);
	const [alert, set_alert] 				= J.utils.useReducerAtom(A.alert, S.other.reducers.alert);

	const [activities, set_activities] 		= J.useAtom(A.activities);
	const [projects, set_projects] 			= J.useAtom(A.projects);
	const [categories, set_categories] 		= J.useAtom(A.categories);
	const [investors, set_investors] 		= J.useAtom(A.investors);
	const [sources, set_sources] 			= J.useAtom(A.sources);
	const [settings, set_settings] 			= J.useAtom(A.settings);

	const RUN_ONLY_ONCE				= [];

	R.useEffect(() => {

		//  initialize alerts from server - manually, because the alerts from fetch_data would overwrite it otherwise
		var old_alert_state = {...alert}; // continuing at the bottom

		M.socket.execute('ACTILOG', 'get_actilog_data', {action: 'get_actilog_data'}, {return: true, timeout: 60})
		.then(function(result) {

			if(result.ok) {

				WH.full_rights 	= result.data.actilog.full_rights; // only if is_owner = true

				let new_rights	= result.data.actilog.rights;
				let new_dummy 	= (parseInt(WH.actilog_id) === 1) ? true : false; // if dummy true, keep all changes local
				let content 	= result.data.actilog.content;
				
				// if soul has write rights to actilog 1, set dummy to false
				if(new_dummy) { if(new_rights.write) { new_dummy = false; } }

				// if dummy true, overwrite  write rights to true
				if(new_dummy) { new_rights.write = true; }
				
				let new_phase 	= (new_rights.read || new_rights.write) ? 'access' : 'forbidden'; // allow access if there is at least read right, or both read&write

				set_phase(new_phase);
				set_rights(new_rights);
				set_dummy(new_dummy);
				set_is_owner(result.data.actilog.is_owner);

				S.other.bridge_data(content); // populates the WH.bridge object
 
				content.projects	= S.projects.format_projects(content);
				content.activities	= S.activities.format_activities(content); // activities must be after projects, because they need them to be formatted
				content.categories 	= S.categories.format_categories(content);
				content.investors 	= S.investors.format_investors(content);
				content.sources 	= S.sources.format_sources(content);

				set_activities(content.activities);
				set_projects(content.projects);
				set_categories(content.categories);
				set_investors(content.investors);
				set_sources(content.sources);
				set_settings(result.data.actilog.content.settings);

				//let new_alert = S.alert.new({type: 'basic', theme: 'success', header: 'Successfully fetched actilog data!',});
				//S.alert.create({new_alert, alert, set_alert});

			} else { return Promise.reject(result.error); }
		
		}).catch(function(err) {

			set_phase('forbidden');

			let new_alert = S.alert.new({type: 'basic', theme: 'error', header: 'Failed to get actilog data!', text: (err.message || err.err_text)});

			S.alert.create({new_alert, alert, set_alert});
			
			M.log.error({id: '[ACTILOG_FHK_01]', message:  'SOCKET FETCH HOOK ERROR', err});
		
		});

		// onload alerts
		if(WH.alerts) { 
			
			WH.alerts.forEach((alert_) => { 
				
				let new_alert = S.alert.new(alert_);

				S.alert.create({new_alert, alert, set_alert});

				delete WH.alerts; 

			});
			
		}

	}, RUN_ONLY_ONCE);

}

exports.actilog_data = actilog_data;
