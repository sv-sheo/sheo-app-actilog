
function C_SOURCES_HEADER_COLUMN(props) {

	const [lang, set_lang] 		= J.useAtom(A.language);
	const [section, set_section]= J.useAtom(A.section);
	const [filter, set_filter] 	= J.useAtom(A.filter);
	const l 					= WH.locales.GET(lang, 'content.header');

	// column year will be ordered by date property (ms since 1970) instead

	return ( 
	
		<div className="header_row column_row sources_column">

			<div className="hell hell_id" title={l.id_hint} >						<C.ORDERING_COLUMN_CELL props={{column: 'id', text: l.id, filter, set_filter, section}} /></div>
			<div className="hell hell_name" title={l.name_hint} >					<C.ORDERING_COLUMN_CELL props={{column: 'name', text: l.name, filter, set_filter, section}} /></div>
			<div className="hell hell_projects" title={l.projects_hint} >			<C.ORDERING_COLUMN_CELL props={{column: 'projects', text: l.projects, filter, set_filter, section}} /></div>
			<div className="hell hell_activities" title={l.activities_hint} >		<C.ORDERING_COLUMN_CELL props={{column: 'activities', text: l.activities, filter, set_filter, section}} /></div>
			<div className="hell hell_time" title={l.time_spent_hint} >				<div className="hell_content">{l.time_spent}</div></div>
			<div className="hell hell_efficiency" title={l.efficiency_hint} >		<div className="hell_content">{l.efficiency}</div></div>
			<div className="hell hell_eff_time" title={l.eff_time_spent_hint} >		<div className="hell_content">{l.eff_time_spent}</div></div>
			<div className="hell hell_expected_yield" title={l.expected_yield_hint}><C.ORDERING_COLUMN_CELL props={{column: 'expected_yield', text: l.expected_yield, filter, set_filter, section}} /></div>
			<div className="hell hell_actual_yield" title={l.actual_yield_hint} >	<C.ORDERING_COLUMN_CELL props={{column: 'actual_yield', text: l.actual_yield, filter, set_filter, section}} /></div>
			
		</div> 
	
	);

}

module.exports = C_SOURCES_HEADER_COLUMN;