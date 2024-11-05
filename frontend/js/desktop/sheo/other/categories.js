
exports.format_categories = function(data) {

	// data 	 = {activities: {}, projects: {}, categories: {}, investors: {}, settings: {}}
	var categories = {};

	_.forEach(data.categories, function(category, cid) {

		categories[cid] = S.categories.format_category(category, data);

	});

	return categories;

}

exports.format_category = function(category, data) {

	// data 			= {activities: {}, projects: {}, categories: {}, investors: {}, settings: {}}
	var c 				= {...category};
	var f 				= {};
	var settings 		= data.settings;
	var activity_ids	= WH.bridge.activities_by_categories[category.id] || {};
	var project_ids		= WH.bridge.projects_by_categories[category.id] || {};
	var currency 		= WH.currencies[settings.units.currency];

	c.projects_count 	= 0;
	c.activities_count 	= 0;
	c.time_spent 		= 0;
	c.eff_time_spent	= 0;
	c.actual_yield		= 0; // sum of actual yields of each project
	var efficiency_sum	= 0;

	var expected_hourly_yields = {/*<p_id>: {ehy: 200, actvities: [1,2, ...]}, ...*/}; // average ehy will be calculated

	_.forEach(project_ids, function(p_id_, p_id) {

		let prj = data.projects[p_id];

		c.projects_count 	+= 1;
		c.actual_yield 		+= prj.actual_yield;

		expected_hourly_yields[p_id] = {ehy: prj.expected_hourly_yield, activities: []};

	});

	_.forEach(activity_ids, function(a_id_, a_id) {

		let a = data.activities[a_id];

		c.activities_count 	+= 1;
		c.time_spent 		+= a.time;
		c.eff_time_spent 	+= a.eff_time;
		efficiency_sum 		+= (a.eff_time / a.time);

		if(expected_hourly_yields[a.project_id]) expected_hourly_yields[a.project_id].activities.push(a_id);

	});

	c.efficiency					= (c.activities_count > 0) ? (efficiency_sum / c.activities_count) : 0; // average efficiency
	c.average_expected_hourly_yield	= S.other.calculate_average_ehy(expected_hourly_yields);
	c.expected_yield 				= c.eff_time_spent * c.average_expected_hourly_yield;

	// formatting for table display (units and stuff)
	f.efficiency 		= Math.round(c.efficiency*100) + ' %';
	f.time_spent 		= c.time_spent.toFixed(settings.values.time_spent_decimals)+' '+settings.units.time;
	f.eff_time_spent 	= c.eff_time_spent.toFixed(settings.values.time_spent_decimals)+' '+settings.units.time;

	f.expected_yield 	= parseFloat(c.expected_yield.toFixed(settings.values.price_decimals));
	f.expected_yield 	= M.helpers.format_currency(f.expected_yield, currency.locale, currency.ticker, settings.values.price_decimals);

	f.actual_yield 		= parseFloat(c.actual_yield.toFixed(settings.values.price_decimals));
	f.actual_yield 		= M.helpers.format_currency(f.actual_yield, currency.locale, currency.ticker, settings.values.price_decimals);

	c.f = f;

	return c;

}

exports.format_category_for_form = function(category) {

	var state 	= {valid: 0, phase: 'input', errors: []};
	var fields 	= {};
	var to_format = ['name'];

	to_format.forEach(function(field) {

		fields[field] = {value: category[field], valid: false, text: '', error: ''};

	})

	return {state, fields};

}