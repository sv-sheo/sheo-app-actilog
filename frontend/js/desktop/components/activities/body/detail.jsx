
function C_ACTIVITIES_BODY_DETAIL(props) {

	// GLOBAL STATE
	const [phase, set_phase] 		= J.useAtom(A.phase);
	const [settings, set_settings] 	= J.useAtom(A.settings);
	const [lang, set_lang] 			= J.useAtom(A.language);
	const navigate 					= R.useNavigate();

	// LOCAL STATE
	const [ready, set_ready] = R.useState(false);

	var left_column = [];
	var right_column = [];

	R.useEffect(() => {

		if(settings && settings.id) set_ready(true);

	}, [settings]);

	if(ready) {

		var p 	= props.props;
		var ACT = p.activity;
		var l 	= {detail: WH.locales.GET(lang, 'content.detail'), activity: WH.locales.GET(lang, 'content.activity')};
		var d_c	= M.helpers.date_to_locale_string(ACT.date, lang);

		var top_row_style = {fontWeight: 'bold', fontSize: '14pt', lineHeight: '18pt'};
		var numeric_style = {width: '100px', textAlign: 'right'};

		var currency = WH.currencies[settings.units.currency];

		var ehy = parseFloat(ACT.expected_hourly_yield.toFixed(settings.values.price_decimals));
			ehy = M.helpers.format_currency(ehy, currency.locale, currency.ticker, settings.values.price_decimals);

		var	edit_button 	= (<button className="btn btn_theme btn_24" disabled={!p.rights.write} 	onClick={function() {p.set_mode('edit')}}>{l.activity.edit_button}</button>);
		var	close_button 	= (<button className="btn btn_warning btn_24"  							onClick={function() {navigate(WH.APP_URL+'/'+p.section);}}>{l.activity.close_button}</button>);
		//var remove_button	= (<C.FORMS_BODY_REMOVE_BTN key={99999} type="activities" props={{...p, activities, set_activities, l, settings, activities, categories, investors}} />);
		var remove_button	= (<C.FORMS_BODY_REMOVE_BTN key={99999} type="activities" props={{...p, item: p.activity, l: l.activity}} />);

		left_column = [

			{header: l.detail.activity, 	content: ACT.activity, 								style: top_row_style, style_h: top_row_style, colon: ':'},
			{header: l.detail.project, 		content: ACT.f.project, 							colon: ':'},
			{header: l.detail.date_plain, 	content: d_c, 										colon: ':'},
			{header: l.detail.category, 	content: ACT.f.category, 							colon: ':'},
			{header: l.detail.investor, 	content: ACT.f.investor, 							colon: ':'},
			{header: l.detail.source, 		content: ACT.f.source, 								colon: ':'},
			{header: 'ID', 					content: ACT.id, 									colon: ':'},
			{header: l.detail.description, content: ACT.description, 							colon: ':', style: {height: 'auto'}, style_warp: {height: 'auto', lineHeight:'1.4', margin: '4px 0'}},


		];

		right_column = [

			{header: '', 								content: '', 							colon: '',  style: top_row_style},
			{header: l.detail.clock, 					content: ACT.clock, 					colon: ':'},
			{header: l.detail.time_spent, 				content: ACT.f.time, 					colon: ':', style: numeric_style},
			{header: l.detail.eff_time_spent, 			content: ACT.f.eff_time, 				colon: ':', style: numeric_style},
			{header: l.detail.efficiency, 				content: ACT.f.efficiency, 				colon: ':', style: numeric_style},
			{header: l.detail.expected_hourly_yield,	content: ehy, 							colon: ':', style: numeric_style},
			{header: l.detail.expected_yield,			content: ACT.f.expected_yield, 			colon: ':', style: numeric_style},
			{header: l.detail.actual_yield,				content: ACT.f.actual_yield, 			colon: ':', style: numeric_style},

			//{header: '',						content: '',							colon: '',},
			// in this stead a <remove_button> component is added manually (below)

		];

	}

	var left_column_rows = left_column.map((row, index) => (

								<div className="id_row id_row_activities" key={index} style={row.style_warp} >

									<div className="id_row_header id_row_header_activities" 	style={row.style_h}>{row.header}{row.colon}</div>
									<div className="id_row_content id_row_content_activities" style={row.style}>{row.content}</div>

								</div>

							));

	var right_column_rows = right_column.map((row, index) => (

								<div className="id_row id_row_activities" key={index} style={row.style_warp} >

									<div className="id_row_header id_row_header_activities" 	style={row.style_h}>{row.header}{row.colon}</div>
									<div className="id_row_content id_row_content_activities" style={row.style}>{row.content}</div>

								</div>

							));

		//right_column_rows.push(remove_button);

	return ( 
	
		<div className="item_detail item_activities_detail">

			<div className="id_column id_column_activities">{left_column_rows}</div>
			<div className="id_column id_column_activities">{right_column_rows}</div>

			<div className="id_buttons id_buttons_activities" >

				<div className="id_row_header id_row_header_activities" >{close_button}</div>
				<div className="id_row_buttons id_row_button_activities">

					<div className="_" style={{marginRight: '6px'}}>{edit_button}</div>
					<div className="_" style={{marginRight: '6px'}}>{remove_button}</div>

				</div>

			</div>

		</div> 
		
	);

}

module.exports = C_ACTIVITIES_BODY_DETAIL;