
function C_SETTINGS_HEADER(props) {

	var l = WH.locales.GET(props.props.lang, 'content.settings');

	return ( 
	
		<div className="content_header settings_header">
			<div className="settings_header_text">{l.header}</div>
		</div> 
	
	);

}

module.exports = C_SETTINGS_HEADER;