
function C_INVESTORS_BODY_DETAIL(props) {

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
		var INV = p.investor;
		var l 	= { detail: WH.locales.GET(lang, 'content.detail'), investor: WH.locales.GET(lang, 'content.investor')};

		var top_row_style = {fontWeight: 'bold', fontSize: '14pt', lineHeight: '18pt'};
		var numeric_style = {width: '100px', textAlign: 'right'};

		var currency = WH.currencies[settings.units.currency];

		var	edit_button 	= (<button className="btn btn_theme btn_24" disabled={!p.rights.write} 	onClick={function() {p.set_mode('edit')}}>{l.investor.edit_button}</button>);
		var	close_button 	= (<button className="btn btn_warning btn_24"  							onClick={function() {navigate(WH.APP_URL+'/'+p.section);}}>{l.investor.close_button}</button>);
		var remove_button	= (<C.FORMS_BODY_REMOVE_BTN key={99999} type="investors" props={{...p, item: p.investor, l: l.investor}} />);

		left_column = [

			{header: l.detail.name, 					content: INV.name, 						style: top_row_style, style_h: top_row_style, colon: ':'},
			{header: 'ID', 								content: INV.id, 						colon: ':'},

			{header: l.investor.address,				content: INV.address, 					colon: ':'},
			{header: l.investor.email,					content: INV.email, 					colon: ':'},
			{header: l.investor.phone,					content: INV.phone, 					colon: ':'},

			{header: l.detail.projects_count,			content: INV.projects_count+'×', 		colon: ':', style: numeric_style},
			{header: l.detail.activities_count,			content: INV.activities_count+'×', 		colon: ':', style: numeric_style},
			{header: l.detail.time_spent, 				content: INV.f.time_spent, 				colon: ':', style: numeric_style},
			{header: l.detail.eff_time_spent, 			content: INV.f.eff_time_spent, 			colon: ':', style: numeric_style},
			{header: l.detail.efficiency, 				content: INV.f.efficiency, 				colon: ':', style: numeric_style},
			{header: l.detail.expected_hourly_yield,	content: INV.average_expected_hourly_yield, colon: ':', style: numeric_style},
			{header: l.detail.expected_yield,			content: INV.f.expected_yield, 			colon: ':', style: numeric_style},
			{header: l.detail.actual_yield,				content: INV.f.actual_yield, 			colon: ':', style: numeric_style},

		];

		right_column = [

			//{header: '', 						content: '', 							colon: '',  style: top_row_style},

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

module.exports = C_INVESTORS_BODY_DETAIL;