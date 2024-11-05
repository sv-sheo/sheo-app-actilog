
function C_PROJECTS_HEADER_SUMMARIES(props) {

	var p 							= props.props;
	const [summaries, set_summaries]= J.useAtom(A.summaries);
	const [filter, set_filter]		= J.useAtom(A.summaries);
	const l 						= WH.locales.GET(p.lang, 'content.header');

	var sums 						= S.other.filter.format_summaries(summaries, p.settings, p.section);
	var add_button 					= (<button className="hc_button hc_button_add" disabled={(p.rights.write) ? false : true} onClick={(e)=>{ if(p.rights.write) p.set_mode("add"); }}>{l.add_button}</button>);

	var date_from 					= filter.activities.date_from ? l.header.date_from+' '+filter.activities.date_from : '';
	var date_to 					= filter.activities.date_to ? l.header.date_to+' '+filter.activities.date_to : '';

	return (p.mode === "summaries") ? ( 

		<div className="control_row_summaries projects_control_summaries">

			<div className="hell hell_date" >			<div className="hell_content"><div className="sum_date_peek">{date_from}</div><div className="sum_date_peek">{date_to}</div></div></div>
			<div className="hell hell_n" >				<div className="hell_content"></div></div>
			<div className="hell hell_name" >			<div className="hell_content">{add_button}</div></div>
			<div className="hell hell_category" >		<div className="hell_content"></div></div>
			<div className="hell hell_investor" >		<div className="hell_content"></div></div>
			<div className="hell hell_source" >			<div className="hell_content"></div></div>
			<div className="hell hell_activities" >		<div className="hell_content">Σ</div></div>
			<div className="hell hell_time" >			<div className="hell_content">{sums.time_spent}</div></div>
			<div className="hell hell_efficiency" >		<div className="hell_content">{sums.efficiency}</div></div>
			<div className="hell hell_eff_time"  >		<div className="hell_content">{sums.eff_time_spent}</div></div>
			<div className="hell hell_expected_yield" >	<div className="hell_content">{sums.expected_yield}</div></div>
			<div className="hell hell_paid"  >			<div className="hell_content"></div></div>
			<div className="hell hell_actual_yield"  >	<div className="hell_content">{sums.actual_yield}</div></div>
			<div className="hell hell_finished"  >		<div className="hell_content"></div></div>

		</div>

	) : (<div style={{display: 'none'}}></div>);

}

module.exports = C_PROJECTS_HEADER_SUMMARIES;