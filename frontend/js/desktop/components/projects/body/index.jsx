
function C_PROJECTS_BODY(props) {

	// GLOBAL STATE
	const [lang, set_lang] 			= J.useAtom(A.language);
	const [phase, set_phase] 		= J.useAtom(A.phase);
	const [filter, set_filter] 		= J.useAtom(A.filter);
	const [filtered, set_filtered] 	= J.useAtom(A.filtered);
	const [rights, set_rights] 		= J.useAtom(A.rights);
	const [section, set_section] 	= J.useAtom(A.section);
	const [categories, set_value] 	= J.useAtom(A.categories);
	const [investors, set_investors]= J.useAtom(A.investors);
	const [sources, set_sources]	= J.useAtom(A.sources);
	const [summaries, set_summaries]= J.useAtom(A.summaries);
	const params 					= R.useParams();
	const navigate 					= R.useNavigate();

	// LOCAL STATE
	const [mode, set_mode] 				= R.useState('detail'); // rows | detail | edit
	const [rows_to_display, set_rows] 	= R.useState([]);

	var p 				= props.props;
	var project_rows 	= [];
	var options 		= {investor: investors, category: categories, source: sources}; // !!! KEYS MUST BE NAMED IN SINGULAR FORM (options will be selected by <column_name>)

	R.useEffect(() => {

		if(section == 'projects' && Object.keys(p.projects).length) {

			var new_filtered= _.cloneDeep(filtered);
			var URL_project = params.pid ? (parseInt(params.pid) || 0) : 0;
				URL_project = (URL_project && p.projects[URL_project]) ? p.projects[URL_project] : null;

			// if the url is like ../projects/<project_id> display only row of this project and open its detail, if the project is unknown, redirect back to ../projects
			if(params.pid) {

				if(URL_project) { if(mode === 'rows') { set_mode('detail');} } else { navigate(WH.APP_URL+'/'+section); }

			} else { set_mode('rows'); }

			if(mode === 'rows') {

				var order_by 	= (filter.__ORDER_BY[section] && filter.__ORDER_BY[section].column && filter.__ORDER_BY[section].direction) ? filter.__ORDER_BY[section] : false;

				// filter and order rows, save the result into new_filtered.projects
				new_filtered[section] = S.other.filter.rows({data: p.projects, filter: filter[section], order_by, options}); // return an array of objects like this [ {id: XX, <column_to_be_filtered>: its value}, {...}, ...]

				if(order_by) new_filtered[section] = M.helpers.sort_arr_of_objects_by_key(new_filtered[section], order_by);

				set_filtered(new_filtered);

			} else if(mode === 'detail' || mode === 'edit') {

				if(URL_project) {

					new_filtered[section] = [{id: URL_project.id, NONE: 0}]; // NONE is default ordering column in filter results

					set_filtered(new_filtered);

				}

			}

		}

	}, [mode, filter, p.projects, lang, params, section /* RUN ON FILTER CHANGE and PROJECTS LOAD and LANG change and URL change */]);

	// RUNS AFTER FINISHING FILTERING - CREATE ROWS AND COUNT SUMMARIES
	R.useEffect(() => {

		if(section == 'projects') {

			var new_summaries 			= _.cloneDeep(summaries);
				new_summaries[section] 	= _.cloneDeep(WH.default_summaries[section] || {}); // reset summaries of this section
			var new_sums 				= new_summaries[section];
			var filter_result 			= filtered[section] || [];

			filter_result.forEach(function(project_row, index) {

				let project = p.projects[project_row.id];
					project_rows.push(<C.PROJECTS_BODY_WARP key={index} props={{project, lang, rights, settings: p.settings, section, mode, set_mode}} />);

				_.forEach(new_sums, (value, column) => { S.other.filter.add_values_to_sums({value, column, new_sums, item: project}); });

			});

			// make an average of efficiencies (mutates the new_sums)
			S.other.filter.make_average_of_summed_efficiencies(new_sums);

			set_summaries(new_summaries);
			set_rows(project_rows);

		}

	}, [filtered]); // run on change of filter results

	return ( 
	
		<div className="section_body projects_body">

			{rows_to_display}

		</div> 
		
	);

}

module.exports = C_PROJECTS_BODY;