
function C_INVESTORS_BODY(props) {

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

		if(section == 'investors' && Object.keys(p.investors).length) {

			var new_filtered = _.cloneDeep(filtered);
			var URL_investor = params.iid ? (parseInt(params.iid) || 0) : 0;
				URL_investor = p.investors[URL_investor] || null;

			// if the url is like ../investors/<investor_id> display only row of this investor and open its detail, if the investor is unknown, redirect back to ../investors
			if(params.iid) {

				if(URL_investor) { if(mode === 'rows') { set_mode('detail');} } else { navigate(WH.APP_URL+'/'+section); }

			} else { set_mode('rows'); }

			if(mode === 'rows') {

				var order_by 	= filter.__ORDER_BY[section];
					order_by 	= (order_by && order_by.column && order_by.direction) ? order_by : false;

				// filter and order rows
				new_filtered[section] = S.other.filter.rows({data: p.investors, filter: filter[section], order_by, options}); // return an array of objects like this [ {id: XX, <column_to_be_filtered>: its value}, {...}, ...]

				if(order_by) new_filtered[section] = M.helpers.sort_arr_of_objects_by_key(new_filtered[section], order_by);

				set_filtered(new_filtered);

				/*var new_summaries 	= _.cloneDeep(WH.default_summaries);
				var new_sums 		= new_summaries[section] || {};
				var old_sums 		= summaries[section] || {};

				filter_result.forEach(function(investor_row, index) {

					let investor = p.investors[investor_row.id];
					item_rows.push(<C.INVESTORS_BODY_WARP key={index} props={{investor, lang, rights, settings: p.settings, mode, set_mode}} />);

					// count summaries 
					_.forEach(new_sums, (value, column) => { S.other.filter.add_values_to_sums({value, column, new_sums, item: investor}); });

				});

				// make an average of efficiencies (mutates the new_sums)
				S.other.filter.make_average_of_summed_efficiencies(new_sums);

				set_summaries(new_summaries);
				set_rows(item_rows);*/

			} else if(mode === 'detail' || mode === 'edit') {

				if(URL_investor) {

					new_filtered[section] = [{id: URL_investor.id, NONE: 0}]; // NONE is default ordering column in filter results

					set_filtered(new_filtered);

					/*var new_summaries 	= _.cloneDeep(WH.default_summaries);
					var new_sums 		= new_summaries[section] || {};
					
					_.forEach(new_sums, (value, column) => { S.other.filter.add_values_to_sums({value, column, new_sums, item: URL_investor}); });

					item_rows.push(<C.INVESTORS_BODY_WARP key={URL_investor.id} props={{investor: URL_investor, lang, rights, settings: p.settings, mode, set_mode, section}} />);

					// make an average of efficiencies (mutates the new_sums)
					S.other.filter.make_average_of_summed_efficiencies(new_sums);

					set_summaries(new_summaries);
					set_rows(item_rows);*/

				}

			}

		}

	}, [mode, filter, p.investors, lang, params, section /* RUN ON FILTER CHANGE and INVESTORS LOAD and LANG change and URL change */]);

	// RUNS AFTER FINISHING FILTERING - CREATE ROWS AND COUNT SUMMARIES
	R.useEffect(() => {

		if(section == 'investors') {

			var new_summaries 			= _.cloneDeep(summaries);
				new_summaries[section] 	= _.cloneDeep(WH.default_summaries[section] || {}); // reset summaries of this section
			var new_sums 				= new_summaries[section];
			var filter_result 			= filtered[section] || [];

			filter_result.forEach(function(investor_row, index) {

				let investor = p.investors[investor_row.id];
				item_rows.push(<C.INVESTORS_BODY_WARP key={investor.id} props={{investor, lang, rights, settings: p.settings, mode, set_mode, section}} />);

				// count summaries 
				_.forEach(new_sums, (value, column) => { S.other.filter.add_values_to_sums({value, column, new_sums, item: investor}); });

			});

			// make an average of efficiencies (mutates the new_sums)
			S.other.filter.make_average_of_summed_efficiencies(new_sums);

			set_summaries(new_summaries);
			set_rows(item_rows);

		}

	}, [filtered]); // run on change of filter results

	return ( 
	
		<div className="section_body investors_body">

			{rows_to_display}

		</div> 
		
	);

}

module.exports = C_INVESTORS_BODY;