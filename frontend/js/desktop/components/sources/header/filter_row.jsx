
function C_SOURCES_HEADER_FILTER(props) {
	
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
	
		<div className="header_row filter_row sources_filter">

			<div className="hell hell_id">				<C.FILTER_NUMBER 	props={{section, column: 'id', local_filter, set_local_filter}} /></div>
			<div className="hell hell_name">			<C.FILTER_TEXT 		props={{section, column: 'name', local_filter, set_local_filter}} /></div>
			<div className="hell hell_projects">		<div className="hell_content"></div></div>
			<div className="hell hell_activities">		<div className="hell_content"></div></div>
			<div className="hell hell_time">			<div className="hell_content"></div></div>
			<div className="hell hell_efficiency">		<div className="hell_content"></div></div>
			<div className="hell hell_eff_time">		<div className="hell_content"></div></div>
			<div className="hell hell_expected_yield">	<div className="hell_content"></div></div>
			<div className="hell hell_actual_yield">	<div className="hell_content"></div></div>
			
		</div> 
	
	);

}

module.exports = C_SOURCES_HEADER_FILTER;