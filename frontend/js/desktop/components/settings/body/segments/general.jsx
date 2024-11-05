
function C_SETTINGS_SEGMENT_GENERAL(props) {

	var p 			= props.props;
	var segment		= props.name; // segment name
	var inputs		= p.inputs;
	var settings	= p.settings;
	var set_settings= p.set_settings;

	const [state, set_state] = R.useState(1); // segment on/off

	var input_rows = [];

	_.forEach(inputs, function(input) {

		if(input.segment === segment) {

			switch(input.type) {

				case 'text': 	input_rows.push(<C.SETTINGS_INPUTS_TEXT key={input.segment+input.name} props={{...p, input, segment}} />); break;
				case 'number': 	input_rows.push(<C.SETTINGS_INPUTS_NUMBER key={input.segment+input.name} props={{...p, input, segment}} />); break;
				case 'select': 	input_rows.push(<C.SETTINGS_INPUTS_SELECT key={input.segment+input.name} props={{...p, input, segment}} />); break;
				default: /* do nothing */

			}

		}

	});

	var segment_hidden = state ? {display: 'block'} : {display: 'none'};


	return ( 
	
		<div className="settings_segment">

			<div className="ssg_header" onClick={(e)=>{ set_state(!state); }}>{p.l.settings[props.name]}</div>

			<div className="ssg_content" style={segment_hidden}>{input_rows}</div>

		</div> 
	
	);

}

module.exports = C_SETTINGS_SEGMENT_GENERAL;