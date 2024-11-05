
function C_CHART_ITEM(props) {

	var p 			= props.props;
	var section 	= p.section;
	var md			= WH.charts.items[p.chart_item]; // metadata
	var style 		= {width: md.width.value+md.width.units, height: md.height.value+md.height.units};

	var component_switch 	= {line_biaxial: 'CHART_ITEM_LINE_BIAXIAL', pie: 'CHART_ITEM_PIE', monthly_time_overview: 'CHART_ITEM_MONTHLY_TIME_OVERVIEW'};
	var CHART_COMPONENT		= component_switch[md.type];
	var format_method 		= S.other.charts.format_methods[p.chart_item];
	var data 				= [];

	if(CHART_COMPONENT && C[CHART_COMPONENT] && format_method) {

		CHART_COMPONENT = C[CHART_COMPONENT];

		data = format_method(p.filtered[section], p.items, p.lang);

		return ( <div className="charts_item" style={style}><CHART_COMPONENT data={data} props={p} /></div> );

	} else {

		M.log.error({id: '[ACTILOG_CHARTS_01]', message:'Invalid Chart component or format method.', error: new Error('Invalid Chart component or format method.')});

		return null;

	}

}

module.exports = C_CHART_ITEM;