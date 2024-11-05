
function C_INVESTORS_HEADER_UNITS(props) {

	const [settings_, set_settings] 	= J.useAtom(A.settings);
	const curr 							= _.get(settings_, 'units.currency', '');
	const time 							= _.get(settings_, 'units.time', '');

	return ( 
	
		<div className="header_row units_row investors_units">
			
			<div className="hell hell_id">				<div className="hell_content"></div></div>
			<div className="hell hell_name">			<div className="hell_content"></div></div>
			<div className="hell hell_address">			<div className="hell_content"></div></div>
			<div className="hell hell_projects">		<div className="hell_content"></div></div>
			<div className="hell hell_activities">		<div className="hell_content"></div></div>
			<div className="hell hell_time">			<div className="hell_content">[{time}]</div></div>
			<div className="hell hell_efficiency">		<div className="hell_content">[%]</div></div>
			<div className="hell hell_eff_time">		<div className="hell_content">[{time}]</div></div>
			<div className="hell hell_expected_yield">	<div className="hell_content">[{curr}]</div></div>
			<div className="hell hell_actual_yield">	<div className="hell_content">[{curr}]</div></div>
			
		</div> 
	
	);

}

module.exports = C_INVESTORS_HEADER_UNITS;