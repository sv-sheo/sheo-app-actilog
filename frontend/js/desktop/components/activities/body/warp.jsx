
function C_ACTIVITIES_BODY_WARP(props) {

	var p 				= props.props;
	//var default_mode	= p.mode === 'detail' ? 'detail' : 'row';

	// LOCAL STATE
	//const [mode, set_mode] = R.useState(default_mode); // possible modes: row, detail, edit

	//var props_ = {...p, mode, set_mode};

	const detail_HTML 		= (p.mode === 'detail') ? 	<C.ACTIVITIES_BODY_DETAIL props={p} /> : null;
	const edit_HTML 		= (p.mode === 'edit') ? 	<C.ACTIVITIES_BODY_EDIT props={p} /> : null;

	return ( 
	
		<div className="item_warp item_warp_activities">

			<C.ACTIVITIES_BODY_ROW props={p} />

			{detail_HTML}

			{edit_HTML}

		</div> 
		
	);

}

module.exports = C_ACTIVITIES_BODY_WARP;