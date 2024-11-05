
function C_CHARTS(props) {

	var p 			= props.props;
	var l 			= {header: WH.locales.GET(p.lang, 'content.header'),  charts: WH.locales.GET(p.lang, 'content.charts')};
	var section 	= p.section;
	var lang 		= p.lang;

	var chart_list_	= WH.charts.sections[p.section].items;

	// GLOBAL STATE
	const [phase, set_phase] 		= J.useAtom(A.phase);
	const [filtered, set_filtered] 	= J.useAtom(A.filtered);
	const [settings, set_settings] 	= J.useAtom(A.settings);
	const [items, set_items]		= J.useAtom(A[p.section]); // activities, categories, projects, investors, sources

	// LOCAL STATE
	const [chart_list, set_chart_list] = R.useState(chart_list_); 

	var chart_links = [];
	var chart_items = [];

	_.forEach(chart_list, function(on_off, chart_item) { 
		
		chart_links.push(<C.CHART_LINK key={chart_item} props={{chart_list, chart_item, set_chart_list, on_off, l}} />) 
	
	});

	_.forEach(chart_list, function(on_off, chart_item) { 
		
		if(chart_list[chart_item]) chart_items.push(<C.CHART_ITEM key={chart_item} props={{chart_list, chart_item, set_chart_list, on_off, l, section, lang, filtered, settings, items}} />) 
	
	});

	return (p.mode === "charts" && phase === 'access') ? ( 

		<div className="control_row_charts activities_charts_row">

			<div className="charts_menu">

				<div className="charts_menu_header">{l.charts.header}</div>
				<div className="charts_menu_links">{chart_links}</div>

			</div>

			<div className="charts_content">

				<div className="charts_content_header"></div>
				<div className="charts_items">{chart_items}</div>

			</div>

		</div>

	) : (<div style={{display: 'none'}}></div>);

}

module.exports = C_CHARTS;