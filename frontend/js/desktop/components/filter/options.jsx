
function C_FILTER_OPTIONS(props) {

	var p 		= props.props;
	var section	= p.section;
	var column	= p.column;
	var filter 	= p.local_filter[section][column];

	function update_filter(e) {

		var new_filter_value = e.currentTarget.value;

		p.set_local_filter({section, column, filter: new_filter_value});

	}

	return ( 
	
		<div className="filter_warp">
			
			<textarea className="filter_textarea" rows="1" value={filter} onChange={update_filter} />
			
		</div> 
	
	);

}

module.exports = C_FILTER_OPTIONS;