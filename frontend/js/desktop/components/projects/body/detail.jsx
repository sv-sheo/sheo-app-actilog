
function C_PROJECTS_BODY_DETAIL(props) {

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
		var PRJ = p.project;
		var l 	= WH.locales.GET(lang, 'content.detail');
		var d_c	= M.helpers.date_to_locale_string(PRJ.date, lang);
		var d_f	= PRJ.finished ? M.helpers.date_to_locale_string(PRJ.finished, lang) : '';
		var d_p	= PRJ.paid ? M.helpers.date_to_locale_string(PRJ.paid, lang) : '';

		var top_row_style = {fontWeight: 'bold', fontSize: '14pt', lineHeight: '18pt'};
		var numeric_style = {width: '100px', textAlign: 'right'};

		var currency = WH.currencies[settings.units.currency];

		var ehy = parseFloat(PRJ.expected_hourly_yield.toFixed(settings.values.price_decimals));
			ehy = M.helpers.format_currency(ehy, currency.locale, currency.ticker, settings.values.price_decimals);

		var	edit_button 	= (<button className="btn btn_theme btn_24" disabled={!p.rights.write} 	onClick={function() {p.set_mode('edit')}}>{l.edit_button}</button>);
		var	close_button 	= (<button className="btn btn_warning btn_24"  							onClick={function() {navigate(WH.APP_URL+'/'+p.section);}}>{l.close_button}</button>);
		//var remove_button	= (<C.FORMS_BODY_REMOVE_BTN key={99999} type="projects" props={{...p, projects, set_projects, l, settings, activities, categories, investors}} />);
		var remove_button	= (<C.FORMS_BODY_REMOVE_BTN key={99999} type="projects" props={{...p, item: p.project, l}} />);

		left_column = [

			{header: l.name, 		content: PRJ.name, 									style: top_row_style, style_h: top_row_style, colon: ':'},
			{header: 'ID', 			content: PRJ.id, 									colon: ':'},
			{header: l.date, 		content: d_c, 										colon: ':'},
			{header: l.n, 			content: PRJ.n, 									colon: ':'},
			{header: l.description, content: PRJ.description, 							colon: ':', style: {height: 'auto'}, style_warp: {height: 'auto', lineHeight:'1.4', margin: '4px 0'}},
			{header: l.category, 	content: PRJ.category_name, 						colon: ':'},
			{header: l.investor, 	content: PRJ.investor_name, 						colon: ':'},
			{header: l.source, 		content: PRJ.source_name, 							colon: ':'},
			{header: l.finished, 	content: (<div>{PRJ.f.finished} {d_f}</div>), 		colon: ':'},
			{header: l.paid, 		content: (<div>{PRJ.f.paid} {d_p}</div>), 			colon: ':'},

		];

		right_column = [

			{header: '', 						content: '', 							colon: '',  style: top_row_style},
			{header: l.activities_count,		content: PRJ.activities_count+'×', 		colon: ':', style: numeric_style},
			{header: l.time_spent, 				content: PRJ.f.time_spent, 				colon: ':', style: numeric_style},
			{header: l.eff_time_spent, 			content: PRJ.f.eff_time_spent, 			colon: ':', style: numeric_style},
			{header: l.efficiency, 				content: PRJ.f.efficiency, 				colon: ':', style: numeric_style},
			{header: l.expected_hourly_yield,	content: ehy, 							colon: ':', style: numeric_style},
			{header: l.expected_yield,			content: PRJ.f.expected_yield, 			colon: ':', style: numeric_style},
			{header: l.actual_yield,			content: PRJ.f.actual_yield, 			colon: ':', style: numeric_style},

			//{header: '',						content: '',							colon: '',},
			// in this stead a <remove_button> component is added manually (below)

		];

	}

	var left_column_rows = left_column.map((row, index) => (

								<div className="id_row id_row_projects" key={index} style={row.style_warp} >

									<div className="id_row_header id_row_header_projects" 	style={row.style_h}>{row.header}{row.colon}</div>
									<div className="id_row_content id_row_content_projects" style={row.style}>{row.content}</div>

								</div>

							));

	var right_column_rows = right_column.map((row, index) => (

								<div className="id_row id_row_projects" key={index} style={row.style_warp} >

									<div className="id_row_header id_row_header_projects" 	style={row.style_h}>{row.header}{row.colon}</div>
									<div className="id_row_content id_row_content_projects" style={row.style}>{row.content}</div>

								</div>

							));

		//right_column_rows.push(remove_button);

	return ( 
	
		<div className="item_detail item_projects_detail">

			<div className="id_column id_column_projects">{left_column_rows}</div>
			<div className="id_column id_column_projects">{right_column_rows}</div>

			<div className="id_buttons id_buttons_projects" >

				<div className="id_row_header id_row_header_projects" >{close_button}</div>
				<div className="id_row_buttons id_row_button_projects">

					<div className="_" style={{marginRight: '6px'}}>{edit_button}</div>
					<div className="_" style={{marginRight: '6px'}}>{remove_button}</div>

				</div>

			</div>

		</div> 
		
	);

}

module.exports = C_PROJECTS_BODY_DETAIL;