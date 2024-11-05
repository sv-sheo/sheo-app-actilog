

/*
OPTIONS
required        1|0
type            "string", "int", ...
max_length      xy                  only for strings
min_length      xy                  only for strings
range_length    {min: xy, max: xy}  only for strings
max             xy                  only for numbers
min             xy                  only for numbers
range           {min: xy, max: xy}  only for numbers
custom          {test: fn, error: {cz: {}, en: {}, ...}}

*/

var names = 	{			
					id: 		{cz: 'ID', en: 'ID', de: 'ID'},
					n: 			{cz: 'Číslo projektu', en: 'Project number', de: 'Projektnummer'},
					name: 		{cz: 'Název', en: 'Name', de: 'Name'},
					description:{cz: 'Popis', en: 'Description', de: 'Bezeichnung'},
					activity: 	{cz: 'Aktivita', en: 'Activity', de: 'Aktivität'},
					project: 	{cz: 'Projekt', en: 'Project', de: 'Projekt'},
					category: 	{cz: 'Odvětví', en: 'Category', de: 'Kategorie'},
					investor: 	{cz: 'Investor', en: 'Investor', de: 'Investor'},
					source: 	{cz: 'Zadal', en: 'Source', de: 'Quelle'},
					date: 		{cz: 'Založen', en: 'Created', de: 'Erstellt'},
					paid: 		{cz: 'Zaplaceno', en: 'Paid', de: 'Bezahlt'},
					finished: 	{cz: 'Dokončeno', en: 'Done', de: 'Fertig'},

					actual_yield:			{cz: 'Skutečný Zisk', en: 'Actual Yield', de: 'Tatsächlicher Ertrag'},
					expected_hourly_yield:	{cz: 'Hodinová sazba', en: 'Hourly Yield', de: 'Stunden-Rate'},

					address: 	{cz: 'Adresa', en: 'Address', de: 'Fertig'},
					email: 		{cz: 'E-mail', en: 'E-mail', de: 'E-mail'},
					phone: 		{cz: 'Mobil', en: 'Phone number', de: 'Telefonnummer'},

					time:					{cz: 'Čas', en: 'Time', de: 'Ertrag'},
					currency:				{cz: 'Měna', en: 'Currency', de: 'Währung'},
					price_decimals:			{cz: 'Desetinné místo měny', en: 'Price decimals', de: 'Preis Dezimalstellen'},
					time_spent_decimals:	{cz: 'Desetinné místo času', en: 'Time decimals', de: 'Währung Dezimalstellen'},
					download_years:			{cz: 'Roky stažené při načtení', en: 'Years downloaded on load', de: 'Jahre beim Laden heruntergeladen'},

				};

exports.activity_proofs = {

	id: 		{name: names.id, 				options: {required: 1, type: 'number', min: 1}},
	activity: 	{name: names.activity, 			options: {required: 1, type: 'string', max_length: 128}},
	description:{name: names.description, 		options: {required: 0, type: 'string', max_length: 2048}},
	project_id:	{name: names.project, 			options: {required: 1, type: 'number', min: 1}},
	date:		{name: names.date, 				options: {required: 1, type: 'number', min: 0}},
	time:		{name: names.time, 				options: {required: 0, type: 'number', min: 0, max: 99}},
	eff_time:	{name: names.eff_time, 			options: {required: 0, type: 'number', min: 0, max: 99}},

};

exports.project_proofs = {

	id: 		{name: names.id, 				options: {required: 1, type: 'number', min: 1}},
	n: 			{name: names.n, 				options: {required: 1, type: 'number', min: 1}},
	name: 		{name: names.name, 				options: {required: 1, type: 'string', max_length: 128}},
	description:{name: names.description, 		options: {required: 0, type: 'string', max_length: 2048}},
	category:	{name: names.category, 			options: {required: 0, type: 'number', min: 0}},
	investor:	{name: names.investor, 			options: {required: 0, type: 'number', min: 0}},
	source:		{name: names.source, 			options: {required: 0, type: 'number', min: 0}},
	date:		{name: names.date, 				options: {required: 0, type: 'number', min: 0}},
	paid:		{name: names.paid, 				options: {required: 0}},
	finished:	{name: names.finished, 			options: {required: 0}},

	actual_yield:			{name: names.actual_yield, 			options: {required: 0, type: 'number', min: 0}},
	expected_hourly_yield:	{name: names.expected_hourly_yield, options: {required: 0, type: 'number', min: 0}},

};

exports.categories_proofs = {

	name: 		{name: names.name, 				options: {required: 1, type: 'string', max_length: 128}},

};

exports.investors_proofs = {

	name: 		{name: names.name, 				options: {required: 1, type: 'string', max_length: 128}},
	address: 	{name: names.address, 			options: {required: 0, type: 'string', max_length: 128}},
	email: 		{name: names.email, 			options: {required: 0, type: 'string', max_length: 128}},
	phone: 		{name: names.phone, 			options: {required: 0, type: 'string', max_length: 15}},

};

exports.sources_proofs = {

	name: 		{name: names.name, 				options: {required: 1, type: 'string', max_length: 128}},

};

exports.settings_proofs = {

	units: {
		time: 				{name: names.time, 				options: {required: 0, type: 'string', max_length: 4}},
		currency: 			{name: names.currency, 			options: {required: 1, type: 'string', min_length: 3, max_length: 3}},
	},
	values: {
		price_decimals: 	{name: names.price_decimals, 	options: {required: 0, type: 'number', min: 0, max: 6}},
		time_spent_decimals:{name: names.time_spent_decimals,options: {required: 0, type: 'number', min: 0, max: 6}},
	},
	other: {
		download_years: 	{name: names.download_years, 	options: {required: 1, type: 'number', min: 1, max: 100}},
	},

};

exports.activity_adjust = function(activity, settings) {

	var now 				= new Date();
	var time_decimals 		= M._.get(settings, 'values.time_spent_decimals', 0);
	var fields 				= {};
		fields.date 		= parseInt(activity.date) || 0;
		fields.project_id 	= parseInt(activity.project) || 0;
		fields.activity		= activity.activity || '';
		fields.description 	= activity.description || '';
		fields.clock 		= activity.clock || '';

		// adjusting time formats, eff_time cannot be bigger than time
		fields.time 		= parseFloat(activity.time) || 0;
		fields.time 		= parseFloat(fields.time.toFixed(time_decimals)) || 0;
		fields.eff_time 	= parseFloat(activity.eff_time) || 0;
		fields.eff_time 	= (fields.eff_time > fields.time) ? fields.time : fields.eff_time;
		fields.eff_time 	= parseFloat(fields.eff_time.toFixed(time_decimals)) || 0;

	return fields;

}

exports.project_adjust = function(project) {

	var now 				= new Date();
	var fields 				= {};
		fields.n 			= parseInt(project.n) || 0;
		fields.date 		= parseInt(project.date) || 0;
		fields.category 	= parseInt(project.category) || 0;
		fields.investor 	= parseInt(project.investor) || 0;
		fields.source 		= parseInt(project.source) || 0;

		fields.name 		= project.name || '';
		fields.description 	= project.description || '';

		fields.expected_hourly_yield	= parseInt(project.expected_hourly_yield) || 0;
		fields.actual_yield				= parseInt(project.actual_yield) || 0;
		fields.paid						= project.paid ? now.getTime() : false;
		fields.finished					= project.finished ? now.getTime() : false;

	return fields;

}

exports.categories_adjust = function(category) {

	var now 				= new Date();
	var fields 				= {};
		fields.name 		= category.name || '';

	return fields;

}

exports.investors_adjust = function(investor) {

	var now 				= new Date();
	var fields 				= {};
		fields.name 		= investor.name || '';
		fields.address 		= investor.address || '';
		fields.email		= investor.email || '';
		fields.phone 		= investor.phone || '';

	return fields;

}

exports.sources_adjust = function(source) {

	var now 				= new Date();
	var fields 				= {};
		fields.name 		= source.name || '';

	return fields;

}