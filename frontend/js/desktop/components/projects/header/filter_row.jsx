
function C_PROJECTS_HEADER_FILTER(props) {
	
	// GLOBAL STATE
	const [lang, set_lang] 						= J.useAtom(A.language);
	const [section, set_section] 				= J.useAtom(A.section);
	const [global_filter, set_global_filter] 	= J.useAtom(A.filter);

	// LOCAL STATE
	const [local_filter, set_local_filter] 		= R.useReducer(S.other.reducers.filter, _.cloneDeep(WH.default_filter));

	// COPY GLOBAL FILTER TO LOCAL ON INIT (in case of some filter rules given by server)
	R.useEffect(() => { set_local_filter({type: 'full', filter: global_filter}); }, [/* RUN ON MOUNT */]);

	// UPDATE GLOBAL FILTER AFTER 800 ms of not changing the local filter
	R.useEffect(() => { 

		var timeout_ms = 800; // ms
		
		if(WH.filter_update_timeout) clearTimeout(WH.filter_update_timeout);

		WH.filter_update_timeout = setTimeout(function() {set_global_filter(local_filter)}, timeout_ms)
	
	}, [local_filter/* RUN ON CHANGE OF LOCAL FILTER */]);

	const l 				= WH.locales.GET(lang, 'content.header');
	const f_options 		= {default: {value: '', text: '-'}, true: {value: 1, text: '✓'}, false: {value: 0, text: '✕'}}

	return ( 
	
		<div className="header_row filter_row projects_filter">

			<div className="hell hell_date">			<C.FILTER_DATE 		props={{section, column: 'date', local_filter, set_local_filter}} /></div>
			<div className="hell hell_n">				<C.FILTER_NUMBER 	props={{section, column: 'n', local_filter, set_local_filter}} /></div>
			<div className="hell hell_name">			<C.FILTER_TEXT 		props={{section, column: 'name', local_filter, set_local_filter}} /></div>
			<div className="hell hell_category">		<C.FILTER_OPTIONS 	props={{section, column: 'category', local_filter, set_local_filter}} /></div>
			<div className="hell hell_investor">		<C.FILTER_OPTIONS 	props={{section, column: 'investor', local_filter, set_local_filter}} /></div>
			<div className="hell hell_source">			<C.FILTER_OPTIONS 	props={{section, column: 'source', local_filter, set_local_filter}} /></div>
			<div className="hell hell_activities">		<div className="hell_content"></div></div>
			<div className="hell hell_time">			<div className="hell_content"></div></div>
			<div className="hell hell_efficiency">		<div className="hell_content"></div></div>
			<div className="hell hell_eff_time">		<div className="hell_content"></div></div>
			<div className="hell hell_expected_yield">	<div className="hell_content"></div></div>
			<div className="hell hell_paid">			<C.FILTER_BOOL 	props={{section, column: 'paid', options: f_options, local_filter, set_local_filter}} /></div>
			<div className="hell hell_actual_yield">	<div className="hell_content"></div></div>
			<div className="hell hell_finished">		<C.FILTER_BOOL 	props={{section, column: 'finished', options: f_options, local_filter, set_local_filter}} /></div>
			
		</div> 
	
	);

}

module.exports = C_PROJECTS_HEADER_FILTER;