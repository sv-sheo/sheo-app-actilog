
function C_FILTER_DATE(props) {

	var p 			= props.props;
	var section		= p.section;
	var column		= {};
		column.from	= p.column+'_from';
		column.to	= p.column+'_to';
	var filter 		= {};
		filter.from	= p.local_filter[section][column.from] || '';
		filter.to	= p.local_filter[section][column.to] || '';

	var class_name 	= 'filter_date '+section+'_fd';

	function update_filter(e, type) {

		var types = {from: 'from', to: 'to'};
			type  = types[type];

		var new_filter_value 	= e.currentTarget.value;

		if(type) p.set_local_filter({section, column: column[type], filter: new_filter_value});

	}

	return ( 
	
		<div className="filter_warp">
			
			<input className={class_name} name={column.from} type="date" value={filter.from} onChange={(e)=>{update_filter(e, 'from')}} />
			<input className={class_name} name={column.to} type="date" value={filter.to} onChange={(e)=>{update_filter(e, 'to')}} />
			
		</div> 
	
	);

}

module.exports = C_FILTER_DATE;