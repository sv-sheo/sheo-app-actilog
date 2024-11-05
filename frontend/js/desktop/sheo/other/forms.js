
exports.get_overall_state = function(fields) {

	// run through all fields and compute overall validity state, compile errors
	var valid = 1;
	var errors = [];

	_.forEach(fields, function(field, field_name) {

		if( !field.valid ) {
			
			valid 				= 0;
			//errors[field_name] 	= {name: field_name, error: field.error};

		}

	});

	return {valid, errors};

}