
function C_SOURCES_BODY(props) {

	// GLOBAL STATE
	const [lang, set_lang] 			= J.useAtom(A.language);
	const [phase, set_phase] 		= J.useAtom(A.phase);
	const [filter, set_filter] 		= J.useAtom(A.filter);
	const [filtered, set_filtered] 	= J.useAtom(A.filtered);
	const [rights, set_rights] 		= J.useAtom(A.rights);
	const [section, set_section] 	= J.useAtom(A.section);
	const [projects, set_projects] 	= J.useAtom(A.projects);
	const [activities, set_activities]= J.useAtom(A.activities);
	const [summaries, set_summaries]= J.useAtom(A.summaries);
	const params 					= R.useParams();
	const navigate 					= R.useNavigate();

	// LOCAL STATE
	const [mode, set_mode] 				= R.useState('detail'); // rows | detail | edit
	const [rows_to_display, set_rows] 	= R.useState([]);

	const l 			= WH.locales.GET(lang, 'content.header');
	var p 				= props.props;
	var item_rows 		= [];
	var options 		= {}; // !!! KEYS MUST BE NAMED IN SINGULAR FORM (options will be selected by <column_name>)

	R.useEffect(() => {

		if(section == 'sources' && Object.keys(p.sources).length) {

			var new_filtered= _.cloneDeep(filtered);
			var URL_source 	= params.sid ? (parseInt(params.sid) || 0) : 0;
				URL_source 	= p.sources[URL_source] || null;

			// if the url is like ../sources/<source_id> display only row of this source and open its detail, if the source is unknown, redirect back to ../sources
			if(params.sid) {

				if(URL_source) { if(mode === 'rows') { set_mode('detail');} } else { navigate(WH.APP_URL+'/'+section); }

			} else { set_mode('rows'); }

			if(mode === 'rows') {

				var order_by 	= filter.__ORDER_BY[section];
					order_by 	= (order_by && order_by.column && order_by.direction) ? order_by : false;

				// filter and order rows
				new_filtered[section] 	= S.other.filter.rows({data: p.sources, filter: filter[section], order_by, options}); // return an array of objects like this [ {id: XX, <column_to_be_filtered>: its value}, {...}, ...]

				if(order_by) new_filtered[section] = M.helpers.sort_arr_of_objects_by_key(new_filtered[section], order_by);

				set_filtered(new_filtered);

			} else if(mode === 'detail' || mode === 'edit') {

				if(URL_source) {

					new_filtered[section] = [{id: URL_source.id, NONE: 0}]; // NONE is default ordering column in filter results

					set_filtered(new_filtered);

				}

			}

		}

	}, [mode, filter, p.sources, lang, params, section /* RUN ON FILTER CHANGE and SOURCES LOAD and LANG change and URL change */]);

	// RUNS AFTER FINISHING FILTERING - CREATE ROWS AND COUNT SUMMARIES
	R.useEffect(() => {

		if(section == 'sources') {

			var new_summaries 			= _.cloneDeep(summaries);
				new_summaries[section] 	= _.cloneDeep(WH.default_summaries[section] || {}); // reset summaries of this section
			var new_sums 				= new_summaries[section];
			var filter_result 			= filtered[section] || [];

			filter_result.forEach(function(source_row, index) {

				let source = p.sources[source_row.id];
				item_rows.push(<C.SOURCES_BODY_WARP key={source.id} props={{source, lang, rights, settings: p.settings, mode, set_mode, section}} />);

				/* count summaries */
				_.forEach(new_sums, (value, column) => { S.other.filter.add_values_to_sums({value, column, new_sums, item: source}); });

			});

			// make an average of efficiencies (mutates the new_sums)
			S.other.filter.make_average_of_summed_efficiencies(new_sums);

			set_summaries(new_summaries);
			set_rows(item_rows);

		}

	}, [filtered]); // run on change of filter results

	return ( 
	
		<div className="section_body sources_body">

			{rows_to_display}

		</div> 
		
	);

}

module.exports = C_SOURCES_BODY;