
function C_ACTIVITIES_BODY(props) {

	// GLOBAL STATE
	const [lang, set_lang] 			= J.useAtom(A.language);
	const [phase, set_phase] 		= J.useAtom(A.phase);
	const [filter, set_filter] 		= J.useAtom(A.filter);
	const [filtered, set_filtered] 	= J.useAtom(A.filtered);
	const [rights, set_rights] 		= J.useAtom(A.rights);
	const [section, set_section] 	= J.useAtom(A.section);
	const [projects, set_projects] 	= J.useAtom(A.projects);
	const [categories, set_categories]= J.useAtom(A.categories);
	const [investors, set_investors]= J.useAtom(A.investors);
	const [sources, set_sources]	= J.useAtom(A.sources);
	const [summaries, set_summaries]= J.useAtom(A.summaries);
	const params 					= R.useParams();
	const navigate 					= R.useNavigate();

	// LOCAL STATE
	const [mode, set_mode] 				= R.useState('detail'); // rows | detail | edit ... set detail as default to prevent from rendering all activities by default
	const [rows_to_display, set_rows] 	= R.useState([]);

	const l 			= WH.locales.GET(lang, 'content.header');
	var p 				= props.props;
	var activity_rows 	= [];
	var options 		= {project: projects, investor: investors, category: categories, source: sources}; // !!! KEYS MUST BE NAMED IN SINGULAR FORM (options will be selected by <column_name>)

	// FILTERING
	R.useEffect(() => {

		if(section === 'activities' && Object.keys(p.activities).length) {

			var new_filtered	= _.cloneDeep(filtered);
			var URL_activity	= params.actid ? (parseInt(params.actid) || 0) : 0;
				URL_activity	= (URL_activity && p.activities[URL_activity]) ? p.activities[URL_activity] : null;

			// if the url is like ../activities/<activity_id> display only row of this activity and open its detail, if the activity is unknown, redirect back to ../activities
			if(params.actid) {

				if(URL_activity) { if(mode === 'rows') { set_mode('detail');} } else { navigate(WH.APP_URL+'/'+section); }

			} else { set_mode('rows'); }

			if(mode === 'rows') {

				var order_by 	= (filter.__ORDER_BY[section] && filter.__ORDER_BY[section].column && filter.__ORDER_BY[section].direction) ? filter.__ORDER_BY[section] : false;

				// filter and order rows, save the result 
				new_filtered.activities = S.other.filter.rows({data: p.activities, filter: filter[section], order_by, options}); // returns an array of objects like this [ {id: XX, <column_to_be_ordered>: its value}, {...}, ...]

				if(order_by) new_filtered.activities = M.helpers.sort_arr_of_objects_by_key(new_filtered.activities, order_by);

				set_filtered(new_filtered);

			} else if(mode === 'detail' || mode === 'edit') {

				if(URL_activity) {

					new_filtered.activities = [{id: URL_activity.id, NONE: 0}]; // NONE is default ordering column in filter results

					set_filtered(new_filtered);

				}

			}

		}

	}, [mode, filter, p.activities, lang, params, section /* RUN ON FILTER CHANGE and ACTIVITIES LOAD and LANG change and URL change */])

	// RUNS AFTER FINISHING FILTERING - CREATE ROWS AND COUNT SUMMARIES
	R.useEffect(() => {

		if(section === 'activities') {

			var new_summaries 			= _.cloneDeep(summaries);
				new_summaries[section] 	= _.cloneDeep(WH.default_summaries[section] || {}); // reset summaries of this section
			var new_sums 				= new_summaries[section];
			var filter_result 			= filtered[section] || [];

			filter_result.forEach(function(activity_row, index) {

				let activity = p.activities[activity_row.id];
					activity_rows.push(<C.ACTIVITIES_BODY_WARP key={index} props={{activity, lang, rights, settings: p.settings, section, mode, set_mode}} />);

				_.forEach(new_sums, (value, column) => { S.other.filter.add_values_to_sums({value, column, new_sums, item: activity}); });

			});

			// make an average of efficiencies (mutates the new_sums)
			S.other.filter.make_average_of_summed_efficiencies(new_sums);

			set_summaries(new_summaries);
			set_rows(activity_rows);

		}

	}, [filtered]); // run on change of filter results

	return ( 
	
		<div className="section_body activities_body">

			{rows_to_display}

		</div> 
		
	);

}

module.exports = C_ACTIVITIES_BODY;