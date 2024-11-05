
function C_SETTINGS_SEGMENT_RIGHTS(props) {

	if(props.props.is_owner && !props.props.dummy) {

		var p 			= props.props;
		var segment		= props.name; // = rights
		var settings	= p.settings;
		var set_settings= p.set_settings;

		const [state, set_state] = R.useState(1); // segment on/off

		var segment_hidden = state ? {display: 'block'} : {display: 'none'};

		// define init values of input
		p.inputs.rights_read.init_value 		= WH.full_rights.read;
		p.inputs.rights_read_souls.init_value 	= _.get(WH, 'full_rights.read_limiters.souls', {});
		p.inputs.rights_read_souls.init_value 	= Object.keys(p.inputs.rights_read_souls.init_value).join(',');
		p.inputs.rights_read_link.init_value 	= _.get(WH, 'full_rights.read_limiters.link', '');
		p.inputs.rights_write.init_value 		= WH.full_rights.write;
		p.inputs.rights_write_souls.init_value 	= _.get(WH, 'full_rights.write_limiters.souls', {});
		p.inputs.rights_write_souls.init_value 	= Object.keys(p.inputs.rights_write_souls.init_value).join(',');
		p.inputs.rights_write_link.init_value 	= _.get(WH, 'full_rights.write_limiters.link', '');

		return ( 
		
			<div className="settings_segment">

				<div className="ssg_header" onClick={(e)=>{ set_state(!state); }}>{p.l.settings.rights}</div>

				<div className="ssg_content" style={segment_hidden}>
					
					<C.SETTINGS_INPUTS_RIGHTS props={{...p, type: 'read', segment, settings, set_settings}} />
					<C.SETTINGS_INPUTS_RIGHTS props={{...p, type: 'write', segment, settings, set_settings}} />
					
				</div>

			</div> 
		
		);

	} else { return null; }

}

module.exports = C_SETTINGS_SEGMENT_RIGHTS;