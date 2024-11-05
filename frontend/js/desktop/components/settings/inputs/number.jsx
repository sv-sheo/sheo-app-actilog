
function C_SETTINGS_INPUTS_NUMBER(props) {

	var p			= props.props;
	var lang 		= p.lang;
	var set_form	= p.set_form;
	var input 		= p.input;
	var v 			= input.validation;
	var segment		= p.segment;
	var settings	= p.settings;
	var set_settings= p.set_settings;
	var rights 		= p.rights;
	var dummy 		= p.dummy;
	var field 		= p.form.fields[input.name];
	var value 		= field.value || 0;
	var init_value 	= input.init_value || 0;
	var req 		= v.required || false;
	var min 		= parseInt(v.min) ? v.min : 0;
	var max 		= parseInt(v.max) ? v.max : 0;

	var custom_class = {};
		custom_class.row 		= _.get(input, ['class.row'], '');
		custom_class.label 		= _.get(input, ['class.label'], '');
		custom_class.input 		= _.get(input, ['class.input'], '');
		custom_class.result 	= _.get(input, ['class.result'], '');

	var classes	= {

		row: 		"settings_input_row "+custom_class.row,
		label:		"sir_label "+custom_class.label, 
		input:		"sir_input sir_input_number "+custom_class.input,
		result:		"sir_result "+custom_class.result,

	}

	var initial_remote = {sending: 0, timeout: 0, sent: 0, result: {}};

	// LOCAL STATE
	const [remote, set_remote] = R.useReducer(S.other.reducers.settings_remote, initial_remote);

	var result = S.settings.format_result(field, remote, lang); // field.error | field.text | remote content (saving, saved, error)

	// run validation on mount, to initialize state of the input
	R.useEffect(() => { change(init_value, true); }, []);

	function change(value, init) { S.handlers.forms.settings_input_change({value, input, field, lang, set_form, init, remote, set_remote, segment, settings, set_settings, rights, dummy}); }

	function handle_change(e) { change(e.currentTarget.value); }

	return ( 
	
		<div className={classes.row}>

			<div className={classes.label}>{p.l.settings[input.name]}</div>
			<div className={classes.input} style={input.style}>
				
				<input type="number" required={req} min={min} max={max} step={v.step} name={input.name} value={value} onChange={handle_change} />
				
			</div>
			<div className={classes.result}>{result}</div>

		</div>
	
	);

}

module.exports = C_SETTINGS_INPUTS_NUMBER;