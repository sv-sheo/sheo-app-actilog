
function C_ACTIVITIES_BODY_ROW(props) {

	var p 				= props.props;
	var mode_switch		= {rows: 'detail', detail: 'rows', edit: 'rows'};
	const navigate 		= R.useNavigate();

	const [section, set_section] 	= J.useAtom(A.section);

	//function change_mode() { p.set_mode(mode_switch[p.mode]); }
	function change_mode() { 
		
		var new_url = WH.APP_URL+'/'+section;
			new_url = p.mode === 'rows' ? (new_url +'/'+p.activity.id) : new_url;

		navigate(new_url); 
		p.set_mode(mode_switch[p.mode]); 
	
	}

	return ( 
	
		<div className="row activities_row" onClick={change_mode}>

			<div className="cell cell_date">			<div className="cell_content">{p.activity.f.date}</div></div>
			<div className="cell cell_category">		<div className="cell_content">{p.activity.f.category}</div></div>
			<div className="cell cell_project">			<div className="cell_content">{p.activity.f.project}</div></div>
			<div className="cell cell_activity">		<div className="cell_content">{p.activity.activity}</div></div>
			<div className="cell cell_investor">		<div className="cell_content">{p.activity.f.investor}</div></div>
			<div className="cell cell_source">			<div className="cell_content">{p.activity.f.source}</div></div>
			<div className="cell cell_time">			<div className="cell_content">{p.activity.f.time}</div></div>
			<div className="cell cell_efficiency">		<div className="cell_content">{p.activity.f.efficiency}</div></div>
			<div className="cell cell_eff_time">		<div className="cell_content">{p.activity.f.eff_time}</div></div>
			<div className="cell cell_expected_yield">	<div className="cell_content">{p.activity.f.expected_yield}</div></div>
			<div className="cell cell_actual_yield">	<div className="cell_content">{p.activity.f.actual_yield}</div></div>

		</div> 
		
	);

}

module.exports = C_ACTIVITIES_BODY_ROW;