
function C_ACTIVITIES_HEADER_SUMMARIES(props) {

	var p 							= props.props;
	const [summaries, set_summaries]= J.useAtom(A.summaries);
	const [filter, set_filter]		= J.useAtom(A.filter);
	const l 						= {header: WH.locales.GET(p.lang, 'content.header'), activity: WH.locales.GET(p.lang, 'content.activity')};
	const cba 						= {marginTop: "-4px"}; // CSS button row adjust
	var charts_switch 				= {mode: {charts: 'summaries', summaries: 'charts', add: 'summaries'}, text: {charts: l.header.hide_charts, summaries: l.header.charts_button}}

	var add_button 					= (<button 	className="btn btn_theme btn_24" style={cba} disabled={(p.rights.write) ? false : true} 
												onClick={(e)=>{ if(p.rights.write) p.set_mode("add"); }}>{l.activity.add_button}</button>);

	var charts_button 				= (<button 	className="btn btn_info btn_24" style={cba}
												onClick={(e)=>{ p.set_mode(charts_switch.mode[p.mode]); }}>{charts_switch.text[p.mode]}</button>);

	var sums 						= S.other.filter.format_summaries(summaries, p.settings, p.section);
	var date_from 					= filter.activities.date_from ? l.header.date_from+' '+filter.activities.date_from : '';
	var date_to 					= filter.activities.date_to ? l.header.date_to+' '+filter.activities.date_to : '';

	return (p.mode === "summaries" || p.mode === "charts") ? ( 

		<div className="control_row_summaries activities_control_summaries">

			<div className="hell hell_date" >			<div className="hell_content"><div className="sum_date_peek">{date_from}</div><div className="sum_date_peek">{date_to}</div></div></div>
			<div className="hell hell_category" >		<div className="hell_content">{charts_button}</div></div>
			<div className="hell hell_project" >		<div className="hell_content"></div></div>
			<div className="hell hell_activity" >		<div className="hell_content">{add_button}</div></div>
			<div className="hell hell_investor" >		<div className="hell_content"></div></div>
			<div className="hell hell_source" >			<div className="hell_content">Σ</div></div>
			<div className="hell hell_time" >			<div className="hell_content">{sums.time}</div></div>
			<div className="hell hell_efficiency" >		<div className="hell_content">{sums.efficiency}</div></div>
			<div className="hell hell_eff_time"  >		<div className="hell_content">{sums.eff_time}</div></div>
			<div className="hell hell_expected_yield" >	<div className="hell_content">{sums.expected_yield}</div></div>
			<div className="hell hell_actual_yield"  >	<div className="hell_content">{sums.actual_yield}</div></div>

		</div>

	) : (<div style={{display: 'none'}}></div>);

}

module.exports = C_ACTIVITIES_HEADER_SUMMARIES;