
function C_PROJECTS_HEADER_COLUMN(props) {

	const [lang, set_lang] 		= J.useAtom(A.language);
	const [section, set_section]= J.useAtom(A.section);
	const [filter, set_filter] 	= J.useAtom(A.filter);
	const l 					= WH.locales.GET(lang, 'content.header');

	// column year will be ordered by date property (ms since 1970) instead

	return ( 
	
		<div className="header_row column_row projects_column">

			<div className="hell hell_date" title={l.date_hint} >					<C.ORDERING_COLUMN_CELL props={{column: 'date', text: l.date, filter, set_filter, section}} /></div>
			<div className="hell hell_n" title={l.n_hint} >							<C.ORDERING_COLUMN_CELL props={{column: 'n', text: l.n, filter, set_filter, section}} /></div>
			<div className="hell hell_name" title={l.name_hint} >					<C.ORDERING_COLUMN_CELL props={{column: 'name', text: l.name, filter, set_filter, section}} /></div>
			<div className="hell hell_category" title={l.category_hint} >			<C.ORDERING_COLUMN_CELL props={{column: 'category', text: l.category, filter, set_filter, section}} /></div>
			<div className="hell hell_investor" title={l.investor_hint} >			<C.ORDERING_COLUMN_CELL props={{column: 'investor', text: l.investor, filter, set_filter, section}} /></div>
			<div className="hell hell_source" title={l.source_hint} >				<C.ORDERING_COLUMN_CELL props={{column: 'source', text: l.source, filter, set_filter, section}} /></div>
			<div className="hell hell_activities" title={l.activities_hint} >		<div className="hell_content">{l.activities}</div></div>
			<div className="hell hell_time" title={l.time_spent_hint} >				<div className="hell_content">{l.time_spent}</div></div>
			<div className="hell hell_efficiency" title={l.efficiency_hint} >		<div className="hell_content">{l.efficiency}</div></div>
			<div className="hell hell_eff_time" title={l.eff_time_spent_hint} >		<div className="hell_content">{l.eff_time_spent}</div></div>
			<div className="hell hell_expected_yield" title={l.expected_yield_hint}><C.ORDERING_COLUMN_CELL props={{column: 'expected_yield', text: l.expected_yield, filter, set_filter, section}} /></div>
			<div className="hell hell_paid" title={l.paid_hint} >					<C.ORDERING_COLUMN_CELL props={{column: 'paid', text: l.paid, filter, set_filter, section}} /></div>
			<div className="hell hell_actual_yield" title={l.actual_yield_hint} >	<C.ORDERING_COLUMN_CELL props={{column: 'actual_yield', text: l.actual_yield, filter, set_filter, section}} /></div>
			<div className="hell hell_finished" title={l.finished_hint} >			<C.ORDERING_COLUMN_CELL props={{column: 'finished', text: l.finished, filter, set_filter, section}} /></div>
			
		</div> 
	
	);

}

module.exports = C_PROJECTS_HEADER_COLUMN;