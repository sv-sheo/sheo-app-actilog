
exports.format_methods = {

	// list of charts is in S.other.populate_WH();
	daily_yield_time: function(filtered_ids, full_items, lang) { 
		
		let full_item 		= null;
		let data_by_month	= {}; // {<millisiecons_od_2022_june>: {name: "june 2022", time: 0, yield: 0}, 2022_august: {...}, ...}
		let formatted_data 	= [];
		let b 				= {};
		let locale 			= WH.locales_list[lang] || 'en-GB';

		// make sums of yield and time
		_.forEach(filtered_ids, function(fltr_item, index) {

			full_item = full_items[fltr_item.id];

			if(full_item) {

				b.DATE 		= new Date(full_item.date);
				b.DAY_txt 	= b.DATE.getDate();
				b.DAY_txt 	= b.DAY_txt >= 10 ? ''+b.DAY_txt : '0'+b.DAY_txt; 
				b.MONTH_txt	= b.DATE.getFullYear()+'-'+(b.DATE.getMonth()+1)+'-'+b.DAY_txt; // returns "1999-01-25"
				b.MONTH_ms 	= new Date(b.MONTH_txt).getTime();

				// get the monts from reuslt data, or create it if it doesnt exist yet
				data_by_month[b.MONTH_ms] = data_by_month[b.MONTH_ms] || {yield: 0, time: 0};

				data_by_month[b.MONTH_ms].yield += full_item.expected_yield;
				data_by_month[b.MONTH_ms].time += full_item.time;

			}

		});

		// sort data_by_month by month - ascending
		let sorted_months = Object.keys(data_by_month).sort();

		// format months names
		_.forEach(sorted_months, function(month_ms) {

			b.month_date = new Date(parseInt(month_ms));
			data_by_month[month_ms].name = b.month_date.toLocaleString(locale, {month: 'numeric', day: 'numeric', year: 'numeric'});

			formatted_data.push(data_by_month[month_ms]);

		});

		return formatted_data;
	
	},

	monthly_yield_time: function(filtered_ids, full_items, lang) { 
		
		let full_item 		= null;
		let data_by_month	= {}; // {<millisiecons_od_2022_june>: {name: "june 2022", time: 0, yield: 0}, 2022_august: {...}, ...}
		let formatted_data 	= [];
		let b 				= {};
		let locale 			= WH.locales_list[lang] || 'en-GB';

		// make sums of yield and time
		_.forEach(filtered_ids, function(fltr_item, index) {

			full_item = full_items[fltr_item.id];

			if(full_item) {

				b.DATE 		= new Date(full_item.date);
				b.M_txt 	= (b.DATE.getMonth()+1);
				b.M_txt 	= b.M_txt >= 10 ? ''+b.M_txt : '0'+b.M_txt; 
				b.MONTH_txt	= b.DATE.getFullYear()+'-'+b.M_txt+'-03'; // returns "1999-01-03" ... always the third day of the month (time-zone-proof)
				b.MONTH_ms 	= new Date(b.MONTH_txt).getTime();

				// get the monts from reuslt data, or create it if it doesnt exist yet
				data_by_month[b.MONTH_ms] = data_by_month[b.MONTH_ms] || {time: 0, eff_time: 0};

				data_by_month[b.MONTH_ms].time += full_item.time;
				data_by_month[b.MONTH_ms].eff_time += full_item.eff_time;

			}

		});

		// sort data_by_month by month - ascending
		let sorted_months = Object.keys(data_by_month).sort();

		// format months names
		_.forEach(sorted_months, function(month_ms) {

			b.month_date = new Date(parseInt(month_ms));
			data_by_month[month_ms].name = b.month_date.toLocaleString(locale, {month: 'long', year: 'numeric'});

			formatted_data.push(data_by_month[month_ms]);

		});

		return formatted_data;
	
	},

	time_by_categories: function(filtered_ids, full_items, lang) { 
		
		let full_item 		= null;
		let data_by_category= {}; // {<category_name>: {name: "category", time: 0, yield: 0}, lala: {...}, ...}
		let formatted_data 	= [];
		let b 				= {};
		let names 			= {};

		// make sums of yield and time
		_.forEach(filtered_ids, function(fltr_item, index) {

			full_item = full_items[fltr_item.id];

			if(full_item) {

				// get it from result data, or create it if it doesnt exist yet
				data_by_category[full_item.category] 		= data_by_category[full_item.category] || {time: 0};
				data_by_category[full_item.category].time  += full_item.time;

				names[full_item.category] = full_item.f.category;

			}

		});

		// sort data_by_category by category - ascending
		let sorted = Object.keys(data_by_category).sort();

		// format category names
		_.forEach(sorted, function(category) {

			data_by_category[category].name = names[category];
			formatted_data.push(data_by_category[category]);

		});

		return formatted_data;

	},

	time_by_investors: function(filtered_ids, full_items, lang) { 
		
		let full_item 		= null;
		let data_by_investor= {}; // {<investor_name>: {name: "investor", time: 0, yield: 0}, lala: {...}, ...}
		let formatted_data 	= [];
		let b 				= {};
		let names 			= {};

		// make sums of yield and time
		_.forEach(filtered_ids, function(fltr_item, index) {

			full_item = full_items[fltr_item.id];

			if(full_item) {

				// get it from result data, or create it if it doesnt exist yet
				data_by_investor[full_item.investor] 		= data_by_investor[full_item.investor] || {time: 0};
				data_by_investor[full_item.investor].time  += full_item.time;

				names[full_item.investor] = full_item.f.investor;

			}

		});

		// sort data_by_investor by investor - ascending
		let sorted = Object.keys(data_by_investor).sort();

		// format investor names
		_.forEach(sorted, function(investor) {

			data_by_investor[investor].name = names[investor];
			formatted_data.push(data_by_investor[investor]);

		});

		return formatted_data;

	},

	time_by_sources: function(filtered_ids, full_items, lang) { 
		
		let full_item 		= null;
		let data_by_source= {}; // {<source_name>: {name: "source", time: 0, yield: 0}, lala: {...}, ...}
		let formatted_data 	= [];
		let b 				= {};
		let names 			= {};

		// make sums of yield and time
		_.forEach(filtered_ids, function(fltr_item, index) {

			full_item = full_items[fltr_item.id];

			if(full_item) {

				// get it from result data, or create it if it doesnt exist yet
				data_by_source[full_item.source] 		= data_by_source[full_item.source] || {time: 0};
				data_by_source[full_item.source].time  += full_item.time;

				names[full_item.source] = full_item.f.source;

			}

		});

		// sort data_by_source by source - ascending
		let sorted = Object.keys(data_by_source).sort();

		// format source names
		_.forEach(sorted, function(source) {

			data_by_source[source].name = names[source];
			formatted_data.push(data_by_source[source]);

		});

		return formatted_data;

	}

}