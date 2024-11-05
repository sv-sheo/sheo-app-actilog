

function C_FORMS_PROJECT(props) {

	var p 				= props.props;
	var now 			= new Date().getTime();
	var state_			= p.form_data || WH.defaults.project_form; // {state: {}, fields: {}}
	var state 			= _.cloneDeep(state_);
	var section 		= p.section;
	var lang 			= p.lang;
	
	// p.mode & p.set_mode is different ... when form in header, mode is (add || summaries), when form in body mode is (rows || detail || edit) 


	//GLOBAL STATE
	const [activities, set_activities] 	= J.useAtom(A.activities);
	const [projects, set_projects] 		= J.useAtom(A.projects);
	const [categories, set_categories] 	= J.useAtom(A.categories);
	const [investors, set_investors]	= J.useAtom(A.investors);
	const [sources, set_sources]		= J.useAtom(A.sources);
	const [settings, set_settings]		= J.useAtom(A.settings);
	const [rights, set_rights] 			= J.useAtom(A.rights);
	const [dummy, set_dummy] 			= J.useAtom(A.dummy);
	const [alert, set_alert] 			= J.utils.useReducerAtom(A.alert, S.other.reducers.alert);
	var   content 						= {activities, projects, categories, investors, sources, settings};
	var   set							= {activities: set_activities, projects: set_projects, categories: set_categories, investors: set_investors, sources: set_sources, settings: set_settings, alert: set_alert, mode: p.set_mode};

	var cats 							= {0: {id: 0, name: '---'}, ...categories}; // add default category and investor
	var invs 							= {0: {id: 0, name: '---'}, ...investors};
	var srcs 							= {0: {id: 0, name: '---'}, ...sources};

	// LOCAL STATE
	const [form, set_form]	=  R.useReducer(S.other.reducers.form, state);
	const l 				= {general: WH.locales.GET(lang, 'content.form.general'), item: WH.locales.GET(lang, 'content.form.project')};
	const category_options 	= Object.keys(cats).map((cat_id) => { return {value: cats[cat_id].id, text: cats[cat_id].name}});
	const investor_options 	= Object.keys(invs).map((inv_id) => { return {value: invs[inv_id].id, text: invs[inv_id].name}});
	const source_options 	= Object.keys(srcs).map((src_id) => { return {value: srcs[src_id].id, text: srcs[src_id].name}});
		  set.form 			= set_form;

	var disabled_submit 	= form.state.phase === 'sending' ? true : false;
	var project_name 		= (p.project) ? p.project.name : '';
	var headers 			= {add: l.item.new_header, edit: l.item.edit_header+' '+project_name};
	var header 				= headers[p.mode] || headers.add;
	//var submit_text 		= p.mode === 'add' ? l.item.add_button : l.item.edit_button;
	var submit_text 		= l.general.submit;
	var units				= WH.currencies[settings.units.currency].unit;

	var field_data 			= {

		n: 			{name: 'n', 		type: 'number', 		default_value: 0, 	validation: {type: 'number', required: 1, min: 1, max: 99999, step: 1 }, },
		date: 		{name: 'date', 		type: 'datetime-local',	default_value: now, validation: {type: 'datetime', required: 1 }, }, // min/max in ms
		name: 		{name: 'name', 		type: 'text',			default_value: '', 	validation: {type: 'text', required: 1, min: 1, max: 128}, },
		description:{name: 'description',type:'textarea',		default_value: '', 	validation: {type: 'text', required: 0, min: 0, max: 2048}, },
		category:	{name: 'category',	type: 'select',			default_value: 0, 	validation: {type: 'select' }, options: category_options},
		investor:	{name: 'investor',	type: 'select',			default_value: 0, 	validation: {type: 'select' }, options: investor_options},
		source:		{name: 'source',	type: 'select',			default_value: 0, 	validation: {type: 'select' }, options: source_options},
		actual_yield:{name:'actual_yield',type:'number',		default_value: 0, 	validation: {type: 'number', required: 0, min: 0, max: 9999999, step: 1 }, units },
		paid:		{name: 'paid',		type:'checkbox',		default_value: 0, 	validation: {type: 'checkbox', required: 0}, },
		finished:	{name: 'finished',	type:'checkbox',		default_value: 0, 	validation: {type: 'checkbox', required: 0}, },

		expected_hourly_yield: {name: 'expected_hourly_yield', type: 'number', 	default_value: 0, 	validation: {type: 'number', required: 0, min: 0, max: 99999, steps: 1 }, units },

	};

	var errors_HTML	= form.state.errors ? form.state.errors.map((err, index) => {return (<div key={index}>{err}</div>)}): [];
	var error_field = form.state.errors ? ( <div className="fr_submit_error">{errors_HTML}</div> ) : (<div style={{display: 'none'}}></div>);

	function cancel(e) {

		var cancel_modes = {add: 'summaries', edit: 'detail'};

		p.set_mode(cancel_modes[p.mode]);

	}

	function submit(e) {

		if(e.preventDefault) e.preventDefault();

		// allow displaying errors after first submit try
		if( !form.state.first_submit_tried ) set_form({type: 'first_submit_try'});

		if(form.state.valid && form.state.phase !== 'sending' && rights.write ) {

			set_form({type: 'set_phase', phase: 'sending'});

			var edit_p_id	= p.mode === 'edit' ? p.project.id : 0;
			var to_send 	= {mode: p.mode, project_id: edit_p_id, lang, project: M.helpers.pluck(form.fields, 'value')};

			// no dummy, send to the server
			if( !dummy ) {

				M.socket.execute('ACTILOG', 'actilog_upsert_project', {action: 'actilog_upsert_project', ...to_send}, {return: true})
				.then((result) => {

					set_form({type: 'set_phase', phase: 'input'});

					if(result.ok) {

						if(p.mode === 'add') 	S.projects.handle_upsert_add({result, content, l, alert, set});
						if(p.mode === 'edit') 	S.projects.handle_upsert_edit({result, projects, content, l, alert, set});

					} else { set_form({type: 'set_errors', result}); M.log.error({id: '[ACTILOG_FORMP_01]', message:  'SOCKET RESULT ERROR', result}); }

				}).catch((error) => {

					set_form({type: 'set_phase', phase: 'input'});
					set_form({type: 'set_errors', result: {id: '[ACTFP02]', text: 'Unknown error - '+error.message, error}});
					M.log.error({id: '[ACTILOG_FORM_02]', message:'SOCKET ERROR', error});

				});

			// if dummy, do not send to the server
			} else {

				set_form({type: 'set_phase', phase: 'input'});

				try { S.projects.dummy_upsert({p, content, projects, l, alert, set, field_data, form, lang, to_send}); } 
				catch(e) { set_form({type: 'set_errors', result: {id: '[ACTFP02.1]', text: 'Unknown error - '+e.message, error: e}}); M.log.error({id: '[ACTILOG_FORMP_02]', message:'DUMMY SOCKET ERROR', error: e}); }
			
			}

		}

	}

	return ( 

		<form className="content_form projects_form">

			<div className="form_row form_row_project"><div className="fr_label fr_label_project"></div><div className="fr_header fr_header_project">{header}</div></div>

			<C.FORMS_INPUTS_NUMBER 		input={field_data.n} 					data={{l, section, lang, form, set_form}} />
			<C.FORMS_INPUTS_DATE 		input={field_data.date} 				data={{l, section, lang, form, set_form}} />
			<C.FORMS_INPUTS_TEXT 		input={field_data.name} 				data={{l, section, lang, form, set_form}} />
			<C.FORMS_INPUTS_TEXTAREA 	input={field_data.description} 			data={{l, section, lang, form, set_form}} />
			<C.FORMS_INPUTS_SELECT 		input={field_data.category} 			data={{l, section, lang, form, set_form}} />
			<C.FORMS_INPUTS_SELECT 		input={field_data.investor} 			data={{l, section, lang, form, set_form}} />
			<C.FORMS_INPUTS_SELECT 		input={field_data.source} 				data={{l, section, lang, form, set_form}} />
			<C.FORMS_INPUTS_NUMBER 		input={field_data.expected_hourly_yield}data={{l, section, lang, form, set_form}} />
			<C.FORMS_INPUTS_NUMBER 		input={field_data.actual_yield} 		data={{l, section, lang, form, set_form}} />
			<C.FORMS_INPUTS_CHECKBOX 	input={field_data.paid} 				data={{l, section, lang, form, set_form}} />
			<C.FORMS_INPUTS_CHECKBOX 	input={field_data.finished} 			data={{l, section, lang, form, set_form}} />
	
			<div className="form_row form_row_project">

				<div className="fr_label fr_label_project"></div>
				<div className="fr_input fr_input_project">
					
					<div className="_" style={{marginRight: '6px'}}><button className="hc_button hc_button_add" disabled={disabled_submit} onClick={submit}>{submit_text}</button></div>
					<div className="_" style={{marginRight: '6px'}}><button className="hc_button hc_button_cancel" onClick={cancel}>{l.general.cancel}</button></div>
					
					{error_field}

				</div>

			</div>

		</form>

	);

}

module.exports = C_FORMS_PROJECT;