
function C_SETTINGS_INPUTS_RIGHTS(props) {

	var p 			= props.props;
	var lang 		= p.lang;
	var type 		= p.type; // read | write
	var set_form	= p.set_form;
	var options		= [ {value: 'public', text: p.l.settings.public}, {value: 'limited', text: p.l.settings.limited}, {value: 'private', text: p.l.settings.private} ];
	var rights		= p.rights;
	var set_rights	= p.set_rights;

	// in form STATE
	var fields 				= {}
		fields.right 		= p.form.fields['rights_'+type]; // public | limited | private | none
		fields.right_souls 	= p.form.fields['rights_'+type+'_souls'];
		fields.right_link 	= p.form.fields['rights_'+type+'_link'];

	// static data of fields (validation etc) defined in segment
	var inputs 				= {}
		inputs.right 		= p.inputs['rights_'+type]
		inputs.right_souls 	= p.inputs['rights_'+type+'_souls'];
		inputs.right_link 	= p.inputs['rights_'+type+'_link'];

	var classes				= { row: "settings_input_row ", label: "sir_label ", input: "sir_input sir_input_select ", result: "sir_result ", rights_group: 'sir_rights_group', link_btn: 'btn btn_theme btn_24 sir_right_link_btn'};
		classes.link_btn 	= fields.right_link.value ? 'btn btn_error btn_24 sir_right_link_btn' : 'btn btn_theme btn_24 sir_right_link_btn';

	var initial_remote		= {sending: 0, timeout: 0, sent: 0, result: {}};

	// LOCAL STATE
	const [remote_right, set_remote_right] 				= R.useReducer(S.other.reducers.settings_remote, initial_remote);
	const [remote_right_souls, set_remote_right_souls] 	= R.useReducer(S.other.reducers.settings_remote, initial_remote);
	const [remote_right_link, set_remote_right_link] 	= R.useReducer(S.other.reducers.settings_remote, initial_remote);

	var remote 		= {right: remote_right, right_souls: remote_right_souls, right_link: remote_right_link};
	var set_remote 	= {right: set_remote_right, right_souls: set_remote_right_souls, right_link: set_remote_right_link};

	var results 			= {}; 
		results.right 		= S.settings.format_result(fields.right, remote.right, lang); // field.error | field.text | remote content (saving, saved, error)
		results.right_souls = S.settings.format_result(fields.right_souls, remote.right_souls, lang);
		results.right_link 	= S.settings.format_result(fields.right_link, remote.right_link, lang);

	var options_HTML = options.map((option, key) => {return (<option key={key} value={option.value}>{option.text}</option>); })

	// run validation on mount, to initialize state of the input
	R.useEffect(() => { 
		
		change_right(inputs.right.init_value, true); 
		change_right_souls(inputs.right_souls.init_value, true);
		change_right_link(null, true);
	
	}, []);

	function change_right(value, init) { S.handlers.forms.settings_right_change({type, value, input:inputs.right, lang, set_form, set_remote, remote, init, rights, set_rights}); }
	function change_right_souls(value, init) { S.handlers.forms.settings_right_souls_change({type, value, input:inputs.right_souls, lang, set_form, remote, set_remote, init, rights, set_rights}); }
	function change_right_link(e, init) { S.handlers.forms.settings_right_link_change({type, input:inputs.right_link, field: fields.right_link, lang, set_form, remote, set_remote, init, rights, set_rights}); }

	var right_input = (

		<div className={classes.row}>

			<div className={classes.label}>{p.l.settings[type]}</div>
			<div className={classes.input} style={inputs.right.style}>
				
				<select name={inputs.right.name} value={fields.right.value} onChange={(e)=>{change_right(e.currentTarget.value)}}>{options_HTML}</select>
				
			</div>
			<div className={classes.result}>{results.right}</div>

		</div>

	);

	var right_souls_input = null;
	var right_link_input = null;

	if(fields.right.value === 'limited') {

		right_souls_input = (

			<div className={classes.row}>
				<div className={classes.label} title={p.l.settings.right_souls}>{p.l.settings.right_souls}</div>
					<div className={classes.input} style={inputs.right_souls.style}>
						<input type={inputs.right_souls.type} placeholder="<ID>,<ID>..." minLength="0" maxLength="64" name={inputs.right_souls.name} value={(fields.right_souls.value || '')} onChange={(e)=>{change_right_souls(e.currentTarget.value)}} />
					</div>
				<div className={classes.result}>{results.right_souls}</div>
			</div>
		
		);

		right_link_input = (

			<div className={classes.row}>
				<div className={classes.label} title={p.l.settings.right_link}>{p.l.settings.right_link}</div>
					<div className={classes.input} style={inputs.right_link.style}>
						<button className={classes.link_btn} onClick={(e)=>{change_right_link(e)}}>{fields.right_link.value ? p.l.settings.remove_link : p.l.settings.generate_link}</button>
					</div>
				<div className={classes.result}>{results.right_link}</div>
			</div>
		
		);

	} else { right_souls_input = null; right_link_input = null; }

	return ( 
	
		<div className={classes.rights_group}>

			{right_input}
			{right_souls_input}
			{right_link_input}

		</div>
	
	);

}

module.exports = C_SETTINGS_INPUTS_RIGHTS;