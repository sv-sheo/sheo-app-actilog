
function C_FILTER_ORDERING_COLUMN_CELL(props) {

	var p 			= props.props;
	var section		= p.section;
	var column		= p.column;
	var filter 		= p.filter;
	var set_filter 	= p.set_filter;

	var change_ordering = S.handlers.filter.change_ordering; // !! on CTRL + mouse CLICK = cancel (remove) ordering

	var dir_switch 	= {desc: 'down', asc: 'up'};
	var order_data 	= filter.__ORDER_BY[section] || {};
		order_data 	= (order_data.column && order_data.column === column && order_data.direction) ? order_data : false;
	var order_icon 	= order_data ? {className: 'hell_column_order_icon hcoi_'+order_data.direction, src: '/files/get/icons/sort_'+dir_switch[order_data.direction]+'_white.png'} : false;
	
	var order_icon_HTML = order_icon ? <div className={order_icon.className}><img className="hcoi_img" src={order_icon.src} /></div> : '';

	return ( 
	
		<div className="hell_content" onClick={ change_ordering.bind(null, {column, filter, set_filter, section}) } >
			
			<div>{p.text}</div>
			{order_icon_HTML}
			
		</div>
	
	);

}

module.exports = C_FILTER_ORDERING_COLUMN_CELL;