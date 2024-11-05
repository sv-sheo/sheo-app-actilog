
function C_FORMS_BODY_REMOVE_BTN(props) {

	var p 		= props.props;
	var type_ 	= WH.sections[props.type]; // projects | categories | investors |activities | sources | settings
	var style	= {height: 'auto'};

	// GLOBAL STATE
	const [settings, set_settings] 		= J.useAtom(A.settings);
	const [projects, set_projects] 		= J.useAtom(A.projects);
	const [activities, set_activities]	= J.useAtom(A.activities);
	const [categories, set_categories]	= J.useAtom(A.categories);
	const [investors, set_investors] 	= J.useAtom(A.investors);
	const [sources, set_sources] 		= J.useAtom(A.sources);
	const [alert, set_alert] 			= J.utils.useReducerAtom(A.alert, S.other.reducers.alert);
	const [dummy, set_dummy] 			= J.useAtom(A.dummy);
	const [lang, set_lang] 				= J.useAtom(A.language);

	// LOCAL STATE
	const [mode, set_mode] 				= R.useState('hidden'); // hidden || active
	const [result, set_result] 			= R.useState({type: 'info', text: p.l.remove_info}); // type: 'info' || 'error'
	const [replacement, set_replacement]= R.useState(0);  // replacing item (i. e. project to move activities from removed project to)
	const [waiting, set_waiting]		= R.useState(0); 
	const [type, set_type]				= R.useState(type_); 

	var content 		= {activities, projects, categories, investors, sources, settings};

	var remove_methods 	= {activities: S.activities.remove_activity, projects: S.projects.remove_project, categories: S.items.remove_item, investors: S.items.remove_item, sources: S.items.remove_item};
	var remove_method 	= remove_methods[type] || function() {M.log.error('Remove method not found.');};

	var set 			=  {projects: set_projects, activities: set_activities, categories: set_categories, investors: set_investors, sources: set_sources, result: set_result, waiting: set_waiting, alert: set_alert};
	var set_items 		= set[type];

	var items 			= content[type] || {};

	var singulars 		= {activities: 'activity', projects: 'project', categories: 'category', investors: 'investor', sources: 'source',  settings: 'settings'};
	var singular 		= singulars[type] || 'unknown';
	var l 				= WH.locales.GET(lang, 'content.form.'+singular);

	// if removing an activity, there is no replacement needed -> make button active on mount
	R.useEffect(()=>{ if(type==='activities') set_mode('active'); }, []);

	function handle_change(e) { set_replacement(parseInt(e.currentTarget.value)); }
	function handle_click(e) { 
		
		// first step - open remove select if soul has write rights
		if(mode === 'hidden' && p.rights.write && type) {
		
			set_mode('active'); 

		// step 2 - replacing project selected, confirm the delete
		} else if(mode === 'active' && !waiting) {

			var confirmed 		= confirm(p.l.remove_confirm);

			if(confirmed) { 

				if(set_items) {
					
					set_waiting(1); 
					
					remove_method({item: p.item, rights: p.rights, replacement, section: type, content, alert, l, set, dummy});

				} else { M.log.error('Remove button: set_items method not found.'); }

			}

		} else { M.log.error({id: '[ACTILOG_REMBTN_02]', message:'Remove not auhorized, or missing type, or waiting.', error}); }
	
	}

	// create options for replacements
	var options			= {...items, 0: {id: 0, name: '---'}};
	var options_HTML 	= []; 

		_.forEach(options, (item, key) => { if(item.id !== p.item.id) options_HTML.push(<option key={key} value={item.id}>{item.name}</option>); });

	var first_option 	= M.helpers.get_first(items);
		first_option 	= first_option ? first_option.id : null;
	var result_class 	= "content_remove_btn_result content_remove_btn_result_"+result.type;
 
	// do not show select for activities
	var select = (mode === 'active' && type !== 'activities') ? (

		<div>

			<select className="content_remove_btn_select" value={replacement} disabled={!p.rights.write} onChange={handle_change}>{options_HTML}</select>
			<div className={result_class}>{result.text}</div>

		</div>

	) : null;

	if(type === 'activities') select = (<div><div className={result_class}>{result.text}</div></div>);

	R.useEffect(() => {

		set_replacement(first_option);

	}, [] /* RUN ON MOUNT */);

	return ( 
	
		<div className="id_rm_button_warp id_rm_button_warp_projects">

			<div className="id_rm_button id_rm_button_projects" >

				<button className="btn btn_error btn_24" disabled={!p.rights.write} onClick={handle_click}>{p.l.remove_button}</button>

			</div>
			<div className="id_rm_button_result id_rm_button_result_projects" >
				
				{select}
				
			</div>

		</div>
		
	);

}

module.exports = C_FORMS_BODY_REMOVE_BTN;