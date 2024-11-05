
function C_CATEGORIES_HEADER_SUMMARIES(props) {

	var p 							= props.props;
	const allowed 					= {write: (p.rights.write) ? true : false, };
	const [summaries, set_summaries]= J.useAtom(A.summaries);
	const l 						= WH.locales.GET(p.lang, 'content.header');
	const lc 						= WH.locales.GET(p.lang, 'content.category');

	var sums 						= S.other.filter.format_summaries(summaries, p.settings, p.section);
	var add_button 					= (	<button className="hc_button hc_button_add" disabled={!allowed.write} onClick={(e)=>{ if(allowed.write) p.set_mode("add"); }}>
											{lc.add_button}
										</button>);

	return (p.mode === "summaries") ? ( 

		<div className="control_row_summaries categories_control_summaries">

			<div className="hell hell_id" >				<div className="hell_content"></div></div>
			<div className="hell hell_name" >			<div className="hell_content">{add_button}</div></div>
			<div className="hell hell_projects" >		<div className="hell_content"></div></div>
			<div className="hell hell_activities" >		<div className="hell_content">Σ</div></div>
			<div className="hell hell_time" >			<div className="hell_content">{sums.time_spent}</div></div>
			<div className="hell hell_efficiency" >		<div className="hell_content">{sums.efficiency}</div></div>
			<div className="hell hell_eff_time"  >		<div className="hell_content">{sums.eff_time_spent}</div></div>
			<div className="hell hell_expected_yield" >	<div className="hell_content">{sums.expected_yield}</div></div>
			<div className="hell hell_actual_yield"  >	<div className="hell_content">{sums.actual_yield}</div></div>

		</div>

	) : null;

}

module.exports = C_CATEGORIES_HEADER_SUMMARIES;