
function C_PROJECTS_BODY_ROW(props) {

	var p 				= props.props;
	var mode_switch		= {rows: 'detail', detail: 'rows', edit: 'rows'};
	const navigate 		= R.useNavigate();

	const [section, set_section] 	= J.useAtom(A.section);

	//function change_mode() { p.set_mode(mode_switch[p.mode]); }
	function change_mode() { 
		
		var new_url = WH.APP_URL+'/'+section;
			new_url = p.mode === 'rows' ? (new_url +'/'+p.project.id) : new_url;

		navigate(new_url); 
		p.set_mode(mode_switch[p.mode]); 
	
	}

	return ( 
	
		<div className="row projects_row" onClick={change_mode}>

			<div className="cell cell_date">			<div className="cell_content">{p.project.f.date}</div></div>
			<div className="cell cell_n">				<div className="cell_content">{p.project.n}</div></div>
			<div className="cell cell_name">			<div className="cell_content">{p.project.name}</div></div>
			<div className="cell cell_category">		<div className="cell_content">{p.project.category_name}</div></div>
			<div className="cell cell_investor">		<div className="cell_content">{p.project.investor_name}</div></div>
			<div className="cell cell_source">			<div className="cell_content">{p.project.source_name}</div></div>
			<div className="cell cell_activities">		<div className="cell_content">{p.project.activities_count}</div></div>
			<div className="cell cell_time">			<div className="cell_content">{p.project.f.time_spent}</div></div>
			<div className="cell cell_efficiency">		<div className="cell_content">{p.project.f.efficiency}</div></div>
			<div className="cell cell_eff_time">		<div className="cell_content">{p.project.f.eff_time_spent}</div></div>
			<div className="cell cell_expected_yield">	<div className="cell_content">{p.project.f.expected_yield}</div></div>
			<div className="cell cell_paid">			<div className="cell_content">{p.project.f.paid}</div></div>
			<div className="cell cell_actual_yield">	<div className="cell_content">{p.project.f.actual_yield}</div></div>
			<div className="cell cell_finished">		<div className="cell_content">{p.project.f.finished}</div></div>

		</div> 
		
	);

}

module.exports = C_PROJECTS_BODY_ROW;