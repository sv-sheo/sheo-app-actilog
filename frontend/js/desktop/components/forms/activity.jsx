

function C_FORMS_ACTIVITY(props) {

	var p 				= props.props;
	var now 			= new Date().getTime();
	var state_			= p.form_data || WH.defaults.activity_form; // {state: {}, fields: {}}
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

	var prjs 							= {99999999: {id: 0, n: '', name: '---'}, ...projects}; // add default project

	// LOCAL STATE
	const [form, set_form]	=  R.useReducer(S.other.reducers.form, state);
	const l 				= {general: WH.locales.GET(lang, 'content.form.general'), item: WH.locales.GET(lang, 'content.form.activity')};
	const project_options 	= Object.keys(prjs).reverse().map((prj_id) => { return {value: prjs[prj_id].id, text: (prjs[prj_id].n+' '+prjs[prj_id].name) }});
		  set.form 			= set_form;

	var disabled_submit 	= form.state.phase === 'sending' ? true : false;
	var activity_name 		= (p.activity) ? p.activity.activity : '';
	var headers 			= {add: l.item.new_header, edit: l.item.edit_header+' '+activity_name};
	var header 				= headers[p.mode] || headers.add;
	//var submit_text 		= p.mode === 'add' ? l.general.submit : l.item.edit_button;
	var submit_text 		= l.general.submit;
	var units				= settings.units.time;
	var time_decimals 		= settings.values.time_spent_decimals;
	var time_step 			= M.helpers.to_range({number: time_decimals, decimals: 0, min: 0, max: 12});
		time_step 			= (1 / Math.pow(10, time_step)); // settings - decimals point = 2 -> time_step = 0.01

	var field_data 			= {

		date: 		{name: 'date', 		type: 'datetime-local',	default_value: now, validation: {type: 'datetime', required: 1 }, }, // min/max in ms
		project:	{name: 'project',	type: 'select',			default_value: 0, 	validation: {type: 'select', required: 1 }, options: project_options},
		activity: 	{name: 'activity', 	type: 'text',			default_value: '', 	validation: {type: 'text', required: 1, min: 1, max: 128}, },
		clock: 		{name: 'clock', 	type: 'text',			default_value: '', 	validation: {type: 'text', required: 0, min: 0, max: 128}, },
		time:		{name: 'time',		type: 'number',			default_value: 0, 	validation: {type: 'number', required: 0, min: 0, max: 99, step: 0.5 }, units },
		eff_time:	{name: 'eff_time',	type: 'number',			default_value: 0, 	validation: {type: 'number', required: 0, min: 0, max: 99, step: 0.5 }, units },
		efficiency:	{name: 'efficiency',type: 'number',			default_value: 0, 	validation: {type: 'number', required: 0, min: 0, max: 100, step: 0.1 }, units: '%' },
		description:{name: 'description',type:'textarea',		default_value: '', 	validation: {type: 'text', required: 0, min: 0, max: 2048}, }

	};

	var errors_HTML	= form.state.errors ? form.state.errors.map((err, index) => {return (<div key={index}>{err}</div>)}): [];
	var error_field = form.state.errors ? ( <div className="fr_submit_error">{errors_HTML}</div> ) : (<div style={{display: 'none'}}></div>);

	// make efficiency inputs interactive with each other
	R.useEffect(S.activities.efficiency_inputs_update_by_time_change.bind(null, {form, field_data, time_decimals, lang, set_form}), [form.fields.time]);
	R.useEffect(S.activities.efficiency_inputs_update_by_eff_time_change.bind(null, {form, field_data, lang, set_form}), [form.fields.eff_time]);
	R.useEffect(S.activities.efficiency_inputs_update_by_efficiency_change.bind(null, {form, field_data, time_decimals, lang, set_form}), [form.fields.efficiency]);

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

			var edit_a_id	= p.mode === 'edit' ? p.activity.id : 0;
			var to_send 	= {mode: p.mode, activity_id: edit_a_id, lang, activity: M.helpers.pluck(form.fields, 'value')};

			// no dummy, send to the server
			if( !dummy ) {

				M.socket.execute('ACTILOG', 'actilog_upsert_activity', {action: 'actilog_upsert_activity', ...to_send}, {return: true})
				.then((result) => {

					set_form({type: 'set_phase', phase: 'input'});

					if(result.ok) {

						if(p.mode === 'add') 	S.activities.handle_upsert_add({result, content, l, alert, field_data, set, form, lang});
						if(p.mode === 'edit') 	S.activities.handle_upsert_edit({result, activities, content, l, alert, set});

					} else { set_form({type: 'set_errors', result}); M.log.error({id: '[ACTILOG_FORM_01]', message:  'SOCKET RESULT ERROR', result}); }

				}).catch((error) => {

					set_form({type: 'set_phase', phase: 'input'});
					set_form({type: 'set_errors', result: {id: '[ACTF02]', text: 'Unknown error - '+error.message, error}});
					M.log.error({id: '[ACTILOG_FORM_02]', message:'SOCKET ERROR', error});

				});

			// if dummy, do not send to the server
			} else {

				set_form({type: 'set_phase', phase: 'input'});

				try { S.activities.dummy_upsert({p, content, activities, l, alert, set, field_data, form, lang, to_send}); } 
				catch(e) { set_form({type: 'set_errors', result: {id: '[ACTF02.1]', text: 'Unknown error - '+e.message, error: e}}); M.log.error({id: '[ACTILOG_FORM_02]', message:'DUMMY SOCKET ERROR', error: e}); }

			}

		}

	}

	return ( 

		<form className="content_form activities_form">

			<div className="form_row form_row_activity"><div className="fr_label fr_label_activity"></div><div className="fr_header fr_header_activity">{header}</div></div>

			<C.FORMS_INPUTS_DATE 		input={field_data.date} 				data={{l, section, lang, form, set_form}} />
			<C.FORMS_INPUTS_SELECT 		input={field_data.project} 				data={{l, section, lang, form, set_form}} />
			<C.FORMS_INPUTS_TEXT 		input={field_data.activity} 			data={{l, section, lang, form, set_form}} />
			<C.FORMS_INPUTS_NUMBER		input={field_data.time}					data={{l, section, lang, form, set_form}} />
			<C.FORMS_INPUTS_NUMBER 		input={field_data.eff_time}				data={{l, section, lang, form, set_form}} />
			<C.FORMS_INPUTS_NUMBER 		input={field_data.efficiency}			data={{l, section, lang, form, set_form}} />
			<C.FORMS_INPUTS_TEXT 		input={field_data.clock} 				data={{l, section, lang, form, set_form}} />
			<C.FORMS_INPUTS_TEXTAREA 	input={field_data.description} 			data={{l, section, lang, form, set_form}} />
	
			<div className="form_row form_row_activity">

				<div className="fr_label fr_label_activity"></div>
				<div className="fr_input fr_input_activity">
					
					<div className="_" style={{marginRight: '6px'}}><button className="hc_button hc_button_add" disabled={disabled_submit} onClick={submit}>{submit_text}</button></div>
					<div className="_" style={{marginRight: '6px'}}><button className="hc_button hc_button_cancel" onClick={cancel}>{l.general.cancel}</button></div>
					
					{error_field}

				</div>

			</div>

		</form>

	);

}

module.exports = C_FORMS_ACTIVITY;