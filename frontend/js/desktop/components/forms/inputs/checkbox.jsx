
function C_FORMS_INPUTS_CHECKBOX(props) {

	var data 	= props.data;
	var lang 	= data.lang;
	var section	= data.section;
	var input 	= props.input;
	var v 		= input.validation;
	var l 		= data.l;
	var field 	= data.form.fields[input.name];
	var value 	= field.value || input.default_value || '';
	var checked = value ? true : false;
	var req 	= v.required || '';

	var classes	= {

		row: 	"form_row form_row_"+section, // form_row_project
		label:	"fr_label fr_label_"+section,
		input:	"fr_input fr_input_"+section,
		text:	"fr_input_checkbox fr_checkbox_text_"+section,
		error:	"fr_error fr_error_"+section,

	}

	var allow_error = data.form.state.first_submit_tried ? true : false;
	var error_field = ( !field.valid && field.error && allow_error ) ? ( <div className={classes.error}>{field.error}</div> ) : (<div style={{display: 'none'}}></div>);

	// run validation on mount, to initialize state of the input
	R.useEffect(() => { change(!value); }, []);

	function change(value) {

		var field_name	= input.name;
		var value 		= !value;
		var valid 		= S.other.validation.run(value, v, lang);
		var value_object= {...valid}; // {value, valid, error, text} 

		var action 		= {type: 'input', value_object, field: field_name};

		data.set_form(action);

	}

	function handle_change(e) { change(e.currentTarget.value); }

	return ( 
	
		<div className={classes.row}>

			<div className={classes.label}>{l.item[input.name]}</div>
			<div className={classes.input}>
				
				<input className={classes.text} type={input.type} required={req} name={input.name} value={value} onChange={handle_change} checked={checked} />
				
			</div>
			{error_field}

		</div>
	
	);

}

module.exports = C_FORMS_INPUTS_CHECKBOX;