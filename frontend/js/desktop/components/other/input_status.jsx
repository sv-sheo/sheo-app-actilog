
function C_INPUT_STATUS(props) {

	var p 			= props.props;
	var class_ 		= "input_status "+p.custom_class;
	var state 		= p.state;
	var icon_switch	= {saving: 'loading.gif', success: 'check1_green.png', error: 'cancel1_red.png', info: ''};
	var icon_src 	= icon_switch[state];
	var icon 		= icon_src ? (<img src={"/files/get/icons/"+icon_src} />) : null;

	return (
		
		<div className={class_}>

			<div className="is_icon">{icon}</div>
			<div className={"is_text is_text_"+state}>{p.text}</div>

		</div>
		
	);

}

module.exports = C_INPUT_STATUS;