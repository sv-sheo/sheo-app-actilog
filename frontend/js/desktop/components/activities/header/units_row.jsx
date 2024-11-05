
function C_ACTIVITIES_HEADER_UNITS(props) {

	// GLOBAL STATE
	const [lang, set_lang] 				= J.useAtom(A.language);
	const [settings_, set_settings] 	= J.useAtom(A.settings);

	const curr 							= _.get(settings_, 'units.currency', '');
	const time 							= _.get(settings_, 'units.time', '');
	const l 							= WH.locales.GET(lang, 'content.header');
	const w 							= {width: '50px'};

	return ( 
	
		<div className="header_row units_row activities_units">
			
			<div className="hell hell_date">			<div className="hell_content"><div className="_" style={w}>{l.date_from}</div><div className="_" style={w}>{l.date_to}</div></div></div>
			<div className="hell hell_category">		<div className="hell_content"></div></div>
			<div className="hell hell_project">			<div className="hell_content"></div></div>
			<div className="hell hell_activity">		<div className="hell_content"></div></div>
			<div className="hell hell_investor">		<div className="hell_content"></div></div>
			<div className="hell hell_source">			<div className="hell_content"></div></div>
			<div className="hell hell_time">			<div className="hell_content">[{time}]</div></div>
			<div className="hell hell_efficiency">		<div className="hell_content">[%]</div></div>
			<div className="hell hell_eff_time">		<div className="hell_content">[{time}]</div></div>
			<div className="hell hell_expected_yield">	<div className="hell_content">[{curr}]</div></div>
			<div className="hell hell_actual_yield">	<div className="hell_content">[{curr}]</div></div>
			
		</div> 
	
	);

}

module.exports = C_ACTIVITIES_HEADER_UNITS;