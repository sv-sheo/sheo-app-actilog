

function C_ALERT_BOX(props) {

	const [opening, set_opening]= R.useState('alert_slide_down');
	var alert 					= props.alert || null;

	// opening animations
	function reset_animation() { setTimeout(function() {set_opening('')}, 1000); }

	R.useEffect(() => { reset_animation(); }, []);
	R.useEffect(() => { set_opening('alert_slide_down'); reset_animation(); }, [props.alert.id]); // run when an alert (alert.id) changes

	if(alert) {

		var theme 		= props.alert.theme || 'info';
		var classname 	= "alert_box "+opening+" alert_"+theme;
		var text_visible= props.alert.text ? 'block' : 'none';

		return (

			<div className="alert_warp" onClick={props.close_alert} style={{display: (props.alert ? 'block' : 'none') }}>

				<div className={classname} style={{}}>

					<div className="alert_box_header">{props.alert.header}</div>
					<div className="alert_box_text" style={{display: text_visible}}>{props.alert.text}</div>

				</div>

			</div>

		);

	} else { return (<div className="alert_warp" style={{display: 'none'}}></div>); }

}

module.exports = C_ALERT_BOX;