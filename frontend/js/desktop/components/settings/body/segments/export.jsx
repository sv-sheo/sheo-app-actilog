
function C_SETTINGS_SEGMENT_EXPORT(props) {

	if(props.props.is_owner && !props.props.dummy) {

		var p 			= props.props;
		var segment		= props.name; // = rights

		const [state, set_state] = R.useState(1); // segment on/off

		var segment_hidden = state ? {display: 'block'} : {display: 'none'};

		var classes		= { row: "settings_input_row ", label: "sir_label ", input: "sir_input sir_input_select ", result: "sir_result ", link_btn: 'btn btn_info btn_24 sir_export_btn'};
		//var now 		= new Date();
		//var filename 	= now.getFullYear()+'_'+now.

		return ( 
		
			<div className="settings_segment">

				<div className="ssg_header" onClick={(e)=>{ set_state(!state); }}>{p.l.settings.export}</div>

				<div className="ssg_content" style={segment_hidden}>

					<div className={classes.row}>
						<div className={classes.label}></div>
							<div className={classes.input} style={{width: '180px'}}>
								<a className={classes.link_btn} onClick={(e)=>{}} href={WH.APP_URL+'/export'} target="_blank" >{p.l.settings.export+' (JSON)'}</a>
							</div>
						<div className={classes.result}></div>
					</div>
					
				</div>

			</div> 
		
		);

	} else { return null; }

}

module.exports = C_SETTINGS_SEGMENT_EXPORT;