
function C_ACTIVITIES_HEADER_COLUMN(props) {

	const [lang, set_lang] 		= J.useAtom(A.language);
	const [section, set_section]= J.useAtom(A.section);
	const [filter, set_filter] 	= J.useAtom(A.filter);
	const l 					= WH.locales.GET(lang, 'content.header');

	// column year will be ordered by date property (ms since 1970) instead

	return ( 
	
		<div className="header_row column_row activities_column">

			<div className="hell hell_date" title={l.date_hint} >					<C.ORDERING_COLUMN_CELL props={{column: 'date', text: l.date, filter, set_filter, section}} /></div>
			<div className="hell hell_category" title={l.category_hint} >			<C.ORDERING_COLUMN_CELL props={{column: 'category', text: l.category, filter, set_filter, section}} /></div>
			<div className="hell hell_project" title={l.project_hint} >				<C.ORDERING_COLUMN_CELL props={{column: 'project', text: l.project, filter, set_filter, section}} /></div>
			<div className="hell hell_activity" title={l.activity_hint} >			<C.ORDERING_COLUMN_CELL props={{column: 'activity', text: l.activity, filter, set_filter, section}} /></div>
			<div className="hell hell_investor" title={l.investor_hint} >			<C.ORDERING_COLUMN_CELL props={{column: 'investor', text: l.investor, filter, set_filter, section}} /></div>
			<div className="hell hell_source" title={l.source_hint} >				<C.ORDERING_COLUMN_CELL props={{column: 'source', text: l.source, filter, set_filter, section}} /></div>
			<div className="hell hell_time" title={l.time_spent_hint} >				<div className="hell_content">{l.time_spent}</div></div>
			<div className="hell hell_efficiency" title={l.efficiency_hint} >		<div className="hell_content">{l.efficiency}</div></div>
			<div className="hell hell_eff_time" title={l.eff_time_spent_hint} >		<div className="hell_content">{l.eff_time_spent}</div></div>
			<div className="hell hell_expected_yield" title={l.expected_yield_hint}><C.ORDERING_COLUMN_CELL props={{column: 'expected_yield', text: l.expected_yield, filter, set_filter, section}} /></div>
			<div className="hell hell_actual_yield" title={l.actual_yield_hint} >	<C.ORDERING_COLUMN_CELL props={{column: 'actual_yield', text: l.actual_yield, filter, set_filter, section}} /></div>
			
		</div> 
	
	);

}

module.exports = C_ACTIVITIES_HEADER_COLUMN;