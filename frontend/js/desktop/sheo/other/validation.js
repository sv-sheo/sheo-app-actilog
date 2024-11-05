
exports.run = function(value, validation={}, lang) {

	var result 	= {value: null, valid: false, text: '', error: ''};
	var l  		= WH.locales.GET(lang, 'content.validation');
	var v 		= validation;
	var types 	= {text: 1, number: 1, date: 1, datetime: 1, select: 1, checkbox: 1, radio: 1};

	if(lang && WH.languages.data[lang]) {

		if(v.type && types[v.type] ) {

			result = S.other.validation[v.type](value, v, lang);

		} else { result.error = l.unknown; M.log.error('[actilog_val_2] Invalid field type'); }

	} else { result.error = l.invalid_language; M.log.error('[actilog_val_1] Invalid language'); }

	return result;

}

exports.number = function(value, validation={}, lang) {

	// validation example: {type: 'number', required: 1, min: 1, max: 9999, step: 1 }

	var result 		= {value: null, valid: false, text: '', error: ''};
	var l  			= WH.locales.GET(lang, 'content.validation');
	var v 			= validation;
	var step 		= parseFloat(validation.step) || 0;
	var decimals 	= M.helpers.count_decimals_of_float(step); // returns 0 if its a whole number
	var is_integer 	= decimals ? false : true;
	var parse_number= is_integer ? parseInt : parseFloat;
		value 		= parse_number(value);
	var required_ok = true;
	var min_ok 		= true;
	var max_ok 		= true;
	var min 		= parseFloat(v.min);
		min 		= Number.isNaN(min) ? false : min;
	var max 		= parseFloat(v.max);
		max 		= Number.isNaN(max) ? false : max;

	if(v.required) {
		
		if(!Number.isNaN(value)) {

			required_ok = 1;

		} else { required_ok = 0; }

	} else { value = value || 0; required_ok = 1; }

	if(min !== false) min_ok = (value >= min);
	if(max !== false) max_ok = (value <= max);

	if(required_ok && min_ok && max_ok) {

		result.valid = true;
		result.error = '';
		result.value = value;

	} else {

		result.value = value;

		if(!min_ok) 	result.error = l.number_too_low + '('+value+'/'+min+')';
		if(!max_ok) 	result.error = l.number_too_high + '('+value+'/'+max+')';
		if(!required_ok)result.error = l.required;

	}

	return result;

}

var datetime = function(value, validation={}, lang) {

	// validation example: {type: 'number', required: 1, min: 1, max: 9999 }

	var result 		= {value: null, valid: false, text: '', error: ''};
	var l  			= WH.locales.GET(lang, 'content.validation');
	var v 			= validation;
	var required_ok = true;
	var min_ok 		= true;
	var max_ok 		= true;
	var min 		= parseInt(v.min);
		min 		= Number.isNaN(min) ? false : min;
	var max 		= parseInt(v.max);
		max 		= Number.isNaN(max) ? false : max;

	if(v.required) 		required_ok = value ? 1 : 0;
	if(min !== false) 	min_ok = (value >= min);
	if(max !== false) 	max_ok = (value <= max);

	if(required_ok && min_ok && max_ok) {

		result.valid = true;
		result.error = '';
		result.value = value;

	} else {

		result.value = value;

		if(!min_ok) 	result.error = l.date_too_low;
		if(!max_ok) 	result.error = l.date_too_high;
		if(!required_ok)result.error = l.required;

	}

	return result;

}

exports.datetime 	= datetime;
exports.date 		= datetime;



exports.text = function(value, validation={}, lang) {

	// validation example: {type: 'number', required: 1, min: 1, max: 9999, steps: 1 }

	var result 		= {value: null, valid: false, text: '', error: ''};
	var l  			= WH.locales.GET(lang, 'content.validation');
	var v 			= validation;
	var required_ok = true;
	var min_ok 		= true;
	var max_ok 		= true;
	var min 		= parseInt(v.min);
		min 		= Number.isNaN(min) ? false : min;
	var max 		= parseInt(v.max);
		max 		= Number.isNaN(max) ? false : max;

	if(v.required) 		required_ok = value ? 1 : 0;
	if(min !== false) 	min_ok = (value.length >= min);
	if(max !== false) 	max_ok = (value.length <= max);

	if(required_ok && min_ok && max_ok) {

		result.valid = true;
		result.error = '';
		result.value = value;

	} else {

		result.value = value;

		if(!min_ok) 	result.error = l.text_too_low + '('+value.length+'/'+min+')';
		if(!max_ok) 	result.error = l.text_too_high + '('+value.length+'/'+max+')';
		if(!required_ok)result.error = l.required;

	}

	return result;

}

exports.select = function(value, validation={}, lang) {

	// validation example: {type: 'number', required: 1, min: 1, max: 9999, steps: 1 }

	var result 		= {value: null, valid: false, text: '', error: ''};
	var l  			= WH.locales.GET(lang, 'content.validation');
	var v 			= validation;
	var required_ok = true;

	if(v.required) 	required_ok = (value !== '') ? 1 : 0;

	if(required_ok) {

		result.valid = true;
		result.error = '';
		result.value = value;

	} else {

		result.value = value;

		if(!required_ok)result.error = l.required;

	}

	return result;

}

exports.checkbox = function(value, validation={}, lang) {

	// validation example: {type: 'number', required: 1 }

	var result 		= {value: null, valid: false, text: '', error: ''};
	var l  			= WH.locales.GET(lang, 'content.validation');
	var v 			= validation;
	var required_ok = true;

	if(v.required) 	required_ok = value ? 1 : 0;

	if(required_ok) {

		result.valid = true;
		result.error = '';
		result.value = value;

	} else {

		result.value = value;
		
		if(!required_ok) result.error = l.required;

	}

	return result;

}