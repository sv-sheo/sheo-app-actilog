
function C_SETTINGS_BODY(props) {

	// GLOBAL STATE
	const [activities, set_activities] 	= J.useAtom(A.activities);
	const [projects, set_projects] 		= J.useAtom(A.projects);
	const [categories, set_categories] 	= J.useAtom(A.categories);
	const [investors, set_investors]	= J.useAtom(A.investors);
	const [sources, set_sources]		= J.useAtom(A.sources);
	const [rights, set_rights]			= J.useAtom(A.rights);
	const [dummy, set_dummy]			= J.useAtom(A.dummy);
	const [is_owner, set_is_owner]		= J.useAtom(A.is_owner);

	var p 				= props.props;
	var settings 		= p.settings;
	var set_settings 	= p.set_settings;
	var lang			= p.lang;
	var l 				= {settings: WH.locales.GET(p.lang, 'content.settings'), general: WH.locales.GET(p.lang, 'content.general')};
	var content 		= {activities, projects, categories, investors, sources, settings};
	var set 			= {activities: set_activities, projects: set_projects, categories: set_categories, investors: set_investors, sources: set_sources, settings: set_settings};
	var options 		= {
							currency: Object.keys(WH.currencies).map(function(curr) {return {text: curr, value: curr}; }),
						};

	var inputs 			= {

							time: 				{ segment: 'units', name: 'time', 			type: 'text', 		init_value: _.get(settings, 'units.time', ''), 				validation: {type: 'text', required: 0, min: 0, max: 4}, 				classes: {},	style: {width:'100px'}},
							currency: 			{ segment: 'units', name: 'currency', 		type: 'select', 	init_value: _.get(settings, 'units.currency', 'CZK'), 		options: options.currency, validation: {type: 'select', required: 1}, 	classes: {},	style: {width:'100px'}},
							price_decimals: 	{ segment: 'values',name: 'price_decimals',	type: 'number', 	init_value: _.get(settings, 'values.price_decimals', 0), 	validation: {type: 'number', required: 0, min: 0, max: 6, step: 1 }, 	classes: {},	style: {width:'60px'}},
							time_spent_decimals:{ segment: 'values',name: 'time_spent_decimals',type: 'number',init_value: _.get(settings, 'values.time_spent_decimals', 0),validation: {type: 'number', required: 0, min: 0, max: 6, step: 1 }, 	classes: {},	style: {width:'60px'}},
							download_years:		{ segment: 'other', name: 'download_years',	type: 'number',		init_value: _.get(settings, 'other.download_years', 0),		validation: {type: 'number', required: 1, min: 1, max: 100, step: 1 }, 	classes: {},	style: {width:'60px'}},
																												// init value is defined in SEGMENT_RIGHTS
							rights_read:		{ segment: 'rights', name: 'rights_read', 		type: 'select', init_value: '', validation: {}, classes: {}, style: {width:'180px'}},
							rights_read_souls:	{ segment: 'rights', name: 'rights_read_souls', type: 'text', 	init_value: '', validation: {}, classes: {}, style: {width:'180px'}},
							rights_read_link:	{ segment: 'rights', name: 'rights_read_link', 	type: 'text', 	init_value: '', validation: {}, classes: {}, style: {width:'180px'}},
							rights_write:		{ segment: 'rights', name: 'rights_write', 		type: 'select', init_value: '', validation: {}, classes: {}, style: {width:'180px'}},
							rights_write_souls:	{ segment: 'rights', name: 'rights_write_souls',type: 'text', 	init_value: '', validation: {}, classes: {}, style: {width:'180px'}},
							rights_write_link:	{ segment: 'rights', name: 'rights_write_link', type: 'text', 	init_value: '', validation: {}, classes: {}, style: {width:'180px'}},

						};

	var settings_fields 	= {time: {/* value object */}, currency: {}, price_decimals: {}, time_spent_decimals: {}, download_years: {}, rights_read: {}, rights_read_souls: {}, rights_read_link: {}, rights_write: {}, rights_write_souls: {}, rights_write_link: {}};
	var initial_form_state 	= {fields: _.cloneDeep(settings_fields)}; /* value object = {value, valid: <bool>, text: '', error: ''} */

	// LOCAL STATE
	const [form, set_form] = R.useReducer(S.other.reducers.settings_form, initial_form_state); // data inside inputs

	// on settings change, recalculate formatted data
	R.useEffect(()=>{S.settings.refresh_content(content, set, settings)}, [settings]);

	return ( 
	
		<div className="section_body settings_body">

			<C.SETTINGS_SEGMENT_GENERAL name="units" props={{settings, set_settings, inputs, l, lang, form, set_form, rights, dummy}} />
			<C.SETTINGS_SEGMENT_GENERAL name="values" props={{settings, set_settings, inputs, l, lang, form, set_form, rights, dummy}} />
			<C.SETTINGS_SEGMENT_RIGHTS name = "rights" props={{settings, set_settings, inputs, l, lang, form, set_form, rights, dummy, is_owner}} />
			<C.SETTINGS_SEGMENT_GENERAL name="other" props={{settings, set_settings, inputs, l, lang, form, set_form, rights, dummy}} />
			<C.SETTINGS_SEGMENT_EXPORT name = "export" props={{l, lang, form, set_form, rights, dummy, is_owner}} />

		</div> 
	
	);

}

module.exports = C_SETTINGS_BODY;