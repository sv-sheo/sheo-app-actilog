
exports.format_investors = function(data) {

	// data 	 = {activities: {}, projects: {}, categories: {}, investors: {}, settings: {}}
	var investors = {};

	_.forEach(data.investors, function(investor, iid) {

		investors[iid] = S.investors.format_investor(investor, data);

	});

	return investors;

}

exports.format_investor = function(investor, data) {

	// data 			= {activities: {}, projects: {}, categories: {}, investors: {}, settings: {}}
	var i 				= {...investor};
	var f 				= {};
	var settings 		= data.settings;
	var activity_ids	= WH.bridge.activities_by_investors[investor.id] || {};
	var project_ids		= WH.bridge.projects_by_investors[investor.id] || {};
	var currency 		= WH.currencies[settings.units.currency];

	i.projects_count 	= 0;
	i.activities_count 	= 0;
	i.time_spent 		= 0;
	i.eff_time_spent	= 0;
	i.actual_yield		= 0; // sum of actual yields of each project
	var efficiency_sum	= 0;

	var expected_hourly_yields = {/*<p_id>: {ehy: 200, actvities: [1,2, ...]}, ...*/}; // average ehy will be calculated

	_.forEach(project_ids, function(p_id_, p_id) {

		let prj = data.projects[p_id];

		i.projects_count 	+= 1;
		i.actual_yield 		+= prj.actual_yield;

		expected_hourly_yields[p_id] = {ehy: prj.expected_hourly_yield, activities: []};

	});

	_.forEach(activity_ids, function(a_id_, a_id) {

		let a = data.activities[a_id];

		i.activities_count 	+= 1;
		i.time_spent 		+= a.time;
		i.eff_time_spent 	+= a.eff_time;
		efficiency_sum 		+= (a.eff_time / a.time);

		if(expected_hourly_yields[a.project_id]) expected_hourly_yields[a.project_id].activities.push(a_id);

	});

	i.efficiency					= (i.activities_count > 0) ? (efficiency_sum / i.activities_count) : 0; // average efficiency
	i.average_expected_hourly_yield	= S.other.calculate_average_ehy(expected_hourly_yields);
	i.expected_yield 				= i.eff_time_spent * i.average_expected_hourly_yield;

	// formatting for table display (units and stuff)
	f.efficiency 		= Math.round(i.efficiency*100) + ' %';
	f.time_spent 		= i.time_spent.toFixed(settings.values.time_spent_decimals)+' '+settings.units.time;
	f.eff_time_spent 	= i.eff_time_spent.toFixed(settings.values.time_spent_decimals)+' '+settings.units.time;

	f.expected_yield 	= parseFloat(i.expected_yield.toFixed(settings.values.price_decimals));
	f.expected_yield 	= M.helpers.format_currency(f.expected_yield, currency.locale, currency.ticker, settings.values.price_decimals);

	f.actual_yield 		= parseFloat(i.actual_yield.toFixed(settings.values.price_decimals));
	f.actual_yield 		= M.helpers.format_currency(f.actual_yield, currency.locale, currency.ticker, settings.values.price_decimals);

	i.f = f;

	return i;

}

exports.format_investor_for_form = function(investor) {

	var state 	= {valid: 0, phase: 'input', errors: []};
	var fields 	= {};
	var to_format = ['name', 'address', 'email', 'phone'];

	to_format.forEach(function(field) {

		fields[field] = {value: investor[field], valid: false, text: '', error: ''};

	})

	return {state, fields};

}