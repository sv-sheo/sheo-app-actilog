
function C_PROJECTS_HEADER_UNITS(props) {

	const [lang, set_lang] 				= J.useAtom(A.settings);
	const [settings_, set_settings] 	= J.useAtom(A.settings);

	const curr 							= _.get(settings_, 'units.currency', '');
	const time 							= _.get(settings_, 'units.time', '');
	const l 							= WH.locales.GET(lang, 'content.header');
	const w 							= {width: '50px'};

	return ( 
	
		<div className="header_row units_row projects_units">
			
			<div className="hell hell_date">			<div className="hell_content"><div className="_" style={w}>{l.date_from}</div><div className="_" style={w}>{l.date_to}</div></div></div>
			<div className="hell hell_n">				<div className="hell_content"></div></div>
			<div className="hell hell_name">			<div className="hell_content"></div></div>
			<div className="hell hell_category">		<div className="hell_content"></div></div>
			<div className="hell hell_investor">		<div className="hell_content"></div></div>
			<div className="hell hell_source">			<div className="hell_content"></div></div>
			<div className="hell hell_activities">		<div className="hell_content"></div></div>
			<div className="hell hell_time">			<div className="hell_content">[{time}]</div></div>
			<div className="hell hell_efficiency">		<div className="hell_content">[%]</div></div>
			<div className="hell hell_eff_time">		<div className="hell_content">[{time}]</div></div>
			<div className="hell hell_expected_yield">	<div className="hell_content">[{curr}]</div></div>
			<div className="hell hell_paid">			<div className="hell_content"></div></div>
			<div className="hell hell_actual_yield">	<div className="hell_content">[{curr}]</div></div>
			
		</div> 
	
	);

}

module.exports = C_PROJECTS_HEADER_UNITS;