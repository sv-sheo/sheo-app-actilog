
function C_FILTER_BOOL(props) {

	var p 		= props.props;
	var section	= p.section;
	var column	= p.column;
	var filter 	= p.local_filter[section][column];
	var options	= p.options || {};
		options.default = options.default || {value: '', text: '-'};

	var option_components = [];

	_.forEach(options, function(option, key) { option_components.push(<option key={key} value={option.value}>{option.text}</option>); });

	function update_filter(e) {

		var new_filter_value = e.currentTarget.value;

		p.set_local_filter({section, column, filter: new_filter_value});

	}

	return ( 
	
		<div className="filter_warp">
			
			<select className="filter_select" value={filter} onChange={update_filter}>

				{option_components}

			</select>
			
		</div> 
	
	);

}

module.exports = C_FILTER_BOOL;