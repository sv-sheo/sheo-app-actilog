
exports.format_sources = function(data) {

	// data 	 = {activities: {}, projects: {}, categories: {}, investors: {}, sources: {}, settings: {}}
	var sources = {};

	_.forEach(data.sources, function(source, sid) {

		sources[sid] = S.sources.format_source(source, data);

	});

	return sources;

}

exports.format_source = function(source, data) {

	// data 			= {activities: {}, projects: {}, categories: {}, investors: {}, sources: {}, settings: {}}
	var s 				= {...source};
	var f 				= {};
	var settings 		= data.settings;
	var activity_ids	= WH.bridge.activities_by_sources[source.id] || {};
	var project_ids		= WH.bridge.projects_by_sources[source.id] || {};
	var currency 		= WH.currencies[settings.units.currency];

	s.projects_count 	= 0;
	s.activities_count 	= 0;
	s.time_spent 		= 0;
	s.eff_time_spent	= 0;
	s.actual_yield		= 0; // sum of actual yields of each project
	var efficiency_sum	= 0;

	var expected_hourly_yields = {/*<p_id>: {ehy: 200, actvities: [1,2, ...]}, ...*/}; // average ehy will be calculated

	_.forEach(project_ids, function(p_id_, p_id) {

		let prj = data.projects[p_id];

		s.projects_count 	+= 1;
		s.actual_yield 		+= prj.actual_yield;

		expected_hourly_yields[p_id] = {ehy: prj.expected_hourly_yield, activities: []};

	});

	_.forEach(activity_ids, function(a_id_, a_id) {

		let a = data.activities[a_id];

		s.activities_count 	+= 1;
		s.time_spent 		+= a.time;
		s.eff_time_spent 	+= a.eff_time;
		efficiency_sum 		+= (a.eff_time / a.time);

		if(expected_hourly_yields[a.project_id]) expected_hourly_yields[a.project_id].activities.push(a_id);

	});

	s.efficiency					= (s.activities_count > 0) ? (efficiency_sum / s.activities_count) : 0; // average efficiency
	s.average_expected_hourly_yield	= S.other.calculate_average_ehy(expected_hourly_yields);
	s.expected_yield 				= s.eff_time_spent * s.average_expected_hourly_yield;

	// formatting for table display (units and stuff)
	f.efficiency 		= Math.round(s.efficiency*100) + ' %';
	f.time_spent 		= s.time_spent.toFixed(settings.values.time_spent_decimals)+' '+settings.units.time;
	f.eff_time_spent 	= s.eff_time_spent.toFixed(settings.values.time_spent_decimals)+' '+settings.units.time;

	f.expected_yield 	= parseFloat(s.expected_yield.toFixed(settings.values.price_decimals));
	f.expected_yield 	= M.helpers.format_currency(f.expected_yield, currency.locale, currency.ticker, settings.values.price_decimals);

	f.actual_yield 		= parseFloat(s.actual_yield.toFixed(settings.values.price_decimals));
	f.actual_yield 		= M.helpers.format_currency(f.actual_yield, currency.locale, currency.ticker, settings.values.price_decimals);

	s.f = f;

	return s;

}

exports.format_source_for_form = function(source) {

	var state 	= {valid: 0, phase: 'input', errors: []};
	var fields 	= {};
	var to_format = ['name'];

	to_format.forEach(function(field) {

		fields[field] = {value: source[field], valid: false, text: '', error: ''};

	})

	return {state, fields};

}