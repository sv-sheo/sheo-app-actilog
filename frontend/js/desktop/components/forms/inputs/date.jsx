
function C_FORMS_INPUTS_DATE(props) {

	var data 	= props.data;
	var lang 	= data.lang;
	var section	= data.section;
	var input 	= props.input;
	var v 		= input.validation;
	var l 		= data.l;
	var field 	= data.form.fields[input.name];
	var value 	= field.value || input.default_value || '';
		value 	= value ? M.helpers.ms_to_HTML_datetime_input(value) : '';
	var req 	= v.required || '';
	var min 	= v.min ? M.helpers.ms_to_HTML_datetime_input(v.min) : ''; // min/max = "YYYY-MM-ddThh:mm" ... "2018-05-04T05:05"
	var max 	= v.max ? M.helpers.ms_to_HTML_datetime_input(v.max) : '';

	var classes	= {

		row: 	"form_row form_row_"+section, // form_row_project
		label:	"fr_label fr_label_"+section,
		input:	"fr_input fr_input_"+section,
		number:	"fr_input_date fr_input_date_"+section,
		error:	"fr_error fr_error_"+section,

	}

	var allow_error = data.form.state.first_submit_tried ? true : false;
	var error_field = ( !field.valid && field.error && allow_error ) ? ( <div className={classes.error}>{field.error}</div> ) : (<div style={{display: 'none'}}></div>);

	// run validation on mount, to initialize state of the input
	R.useEffect(() => { change(value); }, []);

	function change(value) {

		var field_name	= input.name;
		var value 		= value ? new Date(value).getTime() : '';
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
				
				<input className={classes.number} type={input.type} required={req} min={min} max={max} name={input.name} value={value} onChange={handle_change} />
				
			</div>
			{error_field}

		</div>
	
	);

}

module.exports = C_FORMS_INPUTS_DATE;