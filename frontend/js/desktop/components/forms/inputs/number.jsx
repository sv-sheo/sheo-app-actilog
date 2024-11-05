
function C_FORMS_INPUTS_NUMBER(props) {

	var data 	= props.data;
	var lang 	= data.lang;
	var set_form= data.set_form;
	var section	= data.section;
	var input 	= props.input;
	var v 		= input.validation;
	var l 		= data.l;
	var field 	= data.form.fields[input.name];
	var value 	= field.value || input.default_value || 0;

	var classes	= {

		row: 	"form_row form_row_"+section, // form_row_project
		label:	"fr_label fr_label_"+section,
		input:	"fr_input fr_input_"+section,
		number:	"fr_input_number fr_input_number_"+section,
		error:	"fr_error fr_error_"+section,
		units:	"fr_units",

	}

	var allow_error = data.form.state.first_submit_tried ? true : false;
	var error_field = ( !field.valid && field.error && allow_error ) ? ( <div className={classes.error}>{field.error}</div> ) : (<div style={{display: 'none'}}></div>);
	var units 		= input.units ? ' ['+input.units+']' : '';
		units 		= (<div className={classes.units}>{units}</div>);

	// run validation on mount, to initialize state of the input
	R.useEffect(() => { change(value); }, []);

	function change(value) { S.handlers.forms.default_change({value, input, field, lang, set_form}); }

	function handle_change(e) { change(e.currentTarget.value); }

	return ( 
	
		<div className={classes.row}>

			<div className={classes.label}>{l.item[input.name]}</div>
			<div className={classes.input}>
				
				<input className={classes.number} type="number" min={v.min} max={v.max} step={v.step} name={input.name} value={value} onChange={handle_change} />
				
			</div>
			{units}
			{error_field}

		</div>
	
	);

}

module.exports = C_FORMS_INPUTS_NUMBER;