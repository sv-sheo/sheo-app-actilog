
exports.rows = function({data, filter, order_by, options}) {

	var filtered 			= []; // array of objects like [{id: XX, column_to_order_by: its value}, {...}, ...]
	var columns_to_filter	= Object.keys(filter);

	_.forEach(data, function(row, key) {

		var display 		= 1; // pass row by default
		var i 				= 0;
		var date_columns 	= {date_from: 1, date_to: 1};

		// console.log('filtering project ['+row.n+'] '+row.name);

		// loop through filters one by one, if some resolves with the row not to be displayed, break the loop and go to next row
		for(i; i < columns_to_filter.length; i++) {

			let column 			= columns_to_filter[i]; // column name, i.e. "category"
			let filter_method	= S.other.filter.pick_filter_method_by_column[column];
			let filter_value 	= filter[column];
			let is_date 		= date_columns[column];

			if(filter_value || is_date) {

				if(filter_method) {

					//console.log('running filter method ['+col_name+'] for '+row.name)
					display 		= filter_method({filter, row, column, options});

					if( !display ) break; // break filter methods loop on first method returning false

				} else { M.log.error('[actilog_filter_005] Filter method not found.')}

			}

		}

		if(display) {

			var order_column= order_by.column || 'NONE';
			var order_value	= (order_by.column) ? row[order_by.column] : 0;

			var return_filter_object= {id: row.id};
				return_filter_object[order_column] = order_value;

			filtered.push(return_filter_object);

		}

	});

	return filtered;

}

var methods = {

	// return = 1 ... row passes through filter
	filter_by_plain_text: function({filter, row, column}) {

			filter  = filter[column];
		var value 	= row[column];
		var display = 1; // if no filter (e.g. name='') is set, display row (name='')
		var regex 	= new RegExp(filter, 'i'); // i = ignore case, g = global (match all matches ... dont stop after first match is found)

		if(filter) display = regex.test(value);

		return display;

	},

	filter_by_number: function({filter, row, column}) {

			filter  = filter[column];
		var value 	= row[column];
		var display = 1; // if no filter (e.g. name='') is set, display row (name='')
		var i 		= 0;

		if(filter && value && column) {

			// split filter by "," and "-" so that user can search by ranges
			var filter_values = M.helpers.get_items_from_ranges(filter, 100); // 100 = limit

			display = 0;

			for(i; i < filter_values.length; i++) {

				if(parseInt(filter_values[i]) === parseInt(value)) { display = 1; break; }

			}

		}

		return display;

	},

	filter_by_bool: function({filter, row, column}) {

			filter  = filter[column];
		var value 	= row[column];
		var display = 1; // if no filter (e.g. name='') is set, display row

		value 	= parseInt(value) || 0;
		filter 	= parseInt(filter) || 0;

		var both_falsy 	= (!filter && !value);
		var both_truthy = (filter && value);

		display = (both_falsy || both_truthy);

		return display;

	},

	filter_by_options: function({filter, row, column, options}) { // value = id of item

			filter  = filter[column];
		var value 	= row[column];
		var display = 1; // if no filter (e.g. name='') is set, display row
		var i 		= 0;

		if(filter && value && column && options && options[column]) {

			display = 0;

			// split filter by "," and "-" so that user can search by ranges
			var filter_values 	= M.helpers.get_items_from_ranges(filter, 100); // 100 = limit
				options 		= options[column]; // select the options (investors, or categories)

			// get name of value
			var option	= options[value] || {};
			var name_	= option.name || '';

			var search_is_exact_id 	= false;
			var search_matches_name = false;
			var filter_value 		= null;
			var regex 				= null;

			for(i; i < filter_values.length; i++) {

				filter_value 		= filter_values[i];
				search_is_exact_id 	= value === parseInt(filter_value);
				regex 				= new RegExp(filter_value, 'i');
				search_matches_name	= regex.test(name_);

				if(search_is_exact_id || search_matches_name) { 
					
					display = 1; 
					break; 
				
				}

			}

		}

		return display;

	},

	filter_by_date: function({filter, row, column}) {

	
		var display = 1; // if no filter (e.g. name='') is set, display row (name='')

		var true_column_name= column.split('_')[0]; // date_from -> date
		var filter_from 	= filter[true_column_name+'_from'];
		var filter_to 		= filter[true_column_name+'_to'];
		var ms_from 		= filter_from ? M.helpers.HTML_datetime_input_to_ms(filter_from) : 0; // by default from the begining of time
		var ms_to 			= filter_to ? M.helpers.HTML_datetime_input_to_ms(filter_to) : 99999999999999; // by default till the end of time xD ... 14x "9" -> year 5138
		var value 			= row[true_column_name];

			display 		= (value >= ms_from && value <= ms_to);

		//console.log('EEEEEEEEE', value, filter, column, filter_from, filter_to, ms_from, ms_to, value, display ? 'YES' : 'NO');

		return display;

	},

}

exports.pick_filter_method_by_column = {

	name: 		methods.filter_by_plain_text,
	activity: 	methods.filter_by_plain_text,
	year: 		methods.filter_by_number,
	id: 		methods.filter_by_number,
	n: 			methods.filter_by_number,
	project: 	methods.filter_by_options,
	category: 	methods.filter_by_options,
	investor: 	methods.filter_by_options,
	source: 	methods.filter_by_options,
	paid: 		methods.filter_by_bool,
	finished: 	methods.filter_by_bool,
	address: 	methods.filter_by_plain_text,

	date_from:	methods.filter_by_date,
	date_to:	methods.filter_by_date,

}

exports.format_summaries = function(summaries, settings, section) {

	var sums = {};
	
	if(summaries[section] && settings.units) {

		var sums 			= {...summaries[section]};
		var currency 		= WH.currencies[settings.units.currency];
		var time_keys 		= {activities: 'time', projects: 'time_spent', categories: 'time_spent', investors: 'time_spent', sources: 'time_spent',}

		var time_key 		= time_keys[section] || 'time_spent';
		var eff_time_key 	= time_keys[section] ? 'eff_'+time_keys[section] : 'eff_time_spent';

		var time_decimals 	= (sums[time_key] > 999) 		? 0 : settings.values.time_spent_decimals;
		var eff_time_decimals = (sums[eff_time_key] > 999) ? 0 : settings.values.time_spent_decimals;

		sums[time_key] 		= sums[time_key].toFixed(time_decimals)+' '+settings.units.time;
		sums[eff_time_key] 	= sums[eff_time_key].toFixed(eff_time_decimals)+' '+settings.units.time;

		sums.efficiency 	= parseInt(sums.efficiency*100) +' %';

		var EY_decimals 	= (sums.expected_yield > 9999000) 	? 0 : settings.values.price_decimals;
		var AY_decimals 	= (sums.actual_yield > 9999000) 	? 0 : settings.values.price_decimals;
	
		sums.expected_yield = M.helpers.format_currency(parseInt(sums.expected_yield), currency.locale, currency.ticker, EY_decimals);
		sums.actual_yield 	= M.helpers.format_currency(parseInt(sums.actual_yield), currency.locale, currency.ticker, AY_decimals);

	}

	return sums;

}

// mutates the new_sums, no need to return anything
exports.add_values_to_sums = function({value, column, new_sums, item}) {

	// array of values to make an average from
	if(column === 'efficiency') {

		value 			= value || [];
		value.push(item[column]);
		new_sums[column]= value;

	// regular sums
	} else {

		value 			= value || 0;
		new_sums[column]= item[column] ? value + item[column] : value; 

	}

}

exports.make_average_of_summed_efficiencies = function(new_sums) {

	if(new_sums['efficiency'] && Array.isArray(new_sums['efficiency'])) {

		var sum = new_sums['efficiency'].reduce((a, b) => a + b, 0);
		var len = new_sums['efficiency'].length;

		new_sums['efficiency'] = (sum/len);

	}

}

