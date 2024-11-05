
function C_SOURCES_BODY_ROW(props) {

	var p 				= props.props;
	var mode_switch		= {rows: 'detail', detail: 'rows', edit: 'rows'};
	const navigate 		= R.useNavigate();

	const [section, set_section] 	= J.useAtom(A.section);

	//function change_mode() { p.set_mode(mode_switch[p.mode]); }
	function change_mode() { 

		var new_url = WH.APP_URL+'/'+section;
			new_url = p.mode === 'rows' ? (new_url +'/'+p.source.id) : new_url;

		navigate(new_url); 
		p.set_mode(mode_switch[p.mode]); 
	
	}

	return ( 
	
		<div className="row sources_row" onClick={change_mode}>

			<div className="cell cell_id">				<div className="cell_content">{p.source.id}</div></div>
			<div className="cell cell_name">			<div className="cell_content">{p.source.name}</div></div>
			<div className="cell cell_projects">		<div className="cell_content">{p.source.projects_count}</div></div>
			<div className="cell cell_activities">		<div className="cell_content">{p.source.activities_count}</div></div>
			<div className="cell cell_time">			<div className="cell_content">{p.source.f.time_spent}</div></div>
			<div className="cell cell_efficiency">		<div className="cell_content">{p.source.f.efficiency}</div></div>
			<div className="cell cell_eff_time">		<div className="cell_content">{p.source.f.eff_time_spent}</div></div>
			<div className="cell cell_expected_yield">	<div className="cell_content">{p.source.f.expected_yield}</div></div>
			<div className="cell cell_actual_yield">	<div className="cell_content">{p.source.f.actual_yield}</div></div>

		</div> 
		
	);

}

module.exports = C_SOURCES_BODY_ROW;