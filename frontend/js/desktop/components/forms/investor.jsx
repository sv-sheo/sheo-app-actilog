

function C_FORMS_INVESTOR(props) {

	var p 				= props.props;
	var now 			= new Date().getTime();
	var state_			= p.form_data || WH.defaults.investor_form; // {state: {}, fields: {}}
	var state 			= _.cloneDeep(state_);
	var section 		= p.section;
	var lang 			= p.lang;
	
	// p.mode & p.set_mode is different ... when form in header, mode is (add || summaries), when form in body mode is (rows || detail || edit) 


	//GLOBAL STATE
	const [activities, set_activities] 	= J.useAtom(A.activities);
	const [projects, set_projects] 		= J.useAtom(A.projects);
	const [categories, set_categories] 	= J.useAtom(A.categories);
	const [investors, set_investors]	= J.useAtom(A.investors);
	const [settings, set_settings]		= J.useAtom(A.settings);
	const [rights, set_rights] 			= J.useAtom(A.rights);
	const [dummy, set_dummy] 			= J.useAtom(A.dummy);
	const [alert, set_alert] 			= J.utils.useReducerAtom(A.alert, S.other.reducers.alert);
	var   content 						= {activities, projects, categories, investors, settings};

	// LOCAL STATE
	const [form, set_form]	=  R.useReducer(S.other.reducers.form, state);
	const l 				= {general: WH.locales.GET(lang, 'content.form.general'), item: WH.locales.GET(lang, 'content.form.investor')};

	var disabled_submit 	= form.state.phase === 'sending' ? true : false;
	var investor_name 		= (p.investor) ? p.investor.name : ''; // for edit purposes
	var headers 			= {add: l.item.new_header, edit: l.item.edit_header+' '+investor_name};
	var header 				= headers[p.mode] || headers.add;
	var submit_text 		= p.mode === 'add' ? l.item.add_button : l.general.submit;

	var field_data 			= {

		name: 		{name: 'name', 		type: 'text',			default_value: '', 	validation: {type: 'text', required: 1, min: 1, max: 128} },
		address: 	{name: 'address', 	type: 'text',			default_value: '', 	validation: {type: 'text', required: 0, min: 0, max: 128} },
		email: 		{name: 'email', 	type: 'text',			default_value: '', 	validation: {type: 'text', required: 0, min: 0, max: 128} },
		phone: 		{name: 'phone', 	type: 'text',			default_value: '', 	validation: {type: 'text', required: 0, min: 0, max: 15} },

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

			var edit_i_id	= p.mode === 'edit' ? p.investor.id : 0;
			var to_send 	= {mode: p.mode, section, item_id: edit_i_id, lang, item: M.helpers.pluck(form.fields, 'value')};

			// no dummy, send to the server
			if( !dummy ) {

				M.socket.execute('ACTILOG', 'actilog_upsert_item', {action: 'actilog_upsert_item', ...to_send}, {return: true})
				.then((result) => {

					set_form({type: 'set_phase', phase: 'input'});

					if(result.ok) {

						if(p.mode === 'add') 	S.items.handle_upsert_add({result, items: investors, set_items: set_investors, section, content, set_mode: p.set_mode, l, alert, set_alert});
						if(p.mode === 'edit') 	S.items.handle_upsert_edit({result, items: investors, set_items: set_investors, section, content, set_mode: p.set_mode, l, alert, set_alert});

					} else { set_form({type: 'set_errors', result}); M.log.error({id: '[ACTILOG_IFORM_01]', message:  'SOCKET RESULT ERROR', result}); }

				}).catch((error) => {

					set_form({type: 'set_phase', phase: 'input'});
					set_form({type: 'set_errors', result: {id: '[ACTIF02]', text: 'Unknown error - '+error.message, error}});
					M.log.error({id: '[ACTILOG_IFORM_02]', message:'SOCKET ERROR', error});

				});

			// if dummy, do not send to the server
			} else {

				set_form({type: 'set_phase', phase: 'input'});

				try { S.items.dummy_upsert({p, content, items: investors, l, alert, set_alert, set_items: set_investors, form, lang, to_send, set_mode: p.set_mode, section}); } 
				catch(e) { set_form({type: 'set_errors', result: {id: '[ACTIF02.1]', text: 'Unknown error - '+e.message, error: e}}); M.log.error({id: '[ACTILOG_IFORM_02]', message:'DUMMY SOCKET ERROR', error: e}); }

			}

		}

	}

	return ( 

		<form className="content_form investor_form">

			<div className="form_row form_row_investor"><div className="fr_label fr_label_investor"></div><div className="fr_header fr_header_investor">{header}</div></div>

			<C.FORMS_INPUTS_TEXT 		input={field_data.name} 				data={{l, section, lang, form, set_form}} />
			<C.FORMS_INPUTS_TEXT 		input={field_data.address} 				data={{l, section, lang, form, set_form}} />
			<C.FORMS_INPUTS_TEXT 		input={field_data.email} 				data={{l, section, lang, form, set_form}} />
			<C.FORMS_INPUTS_TEXT 		input={field_data.phone} 				data={{l, section, lang, form, set_form}} />
	
			<div className="form_row form_row_investor">

				<div className="fr_label fr_label_investor"></div>
				<div className="fr_input fr_input_investor" style={{marginTop: '10px'}}>
					
					<div className="_" style={{marginRight: '6px'}}><button className="hc_button hc_button_add" disabled={disabled_submit} onClick={submit}>{submit_text}</button></div>
					<div className="_" style={{marginRight: '6px'}}><button className="hc_button hc_button_cancel" onClick={cancel}>{l.general.cancel}</button></div>
					
					{error_field}

				</div>

			</div>

		</form>

	);

}

module.exports = C_FORMS_INVESTOR;