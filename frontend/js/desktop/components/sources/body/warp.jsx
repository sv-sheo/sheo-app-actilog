
function C_SOURCES_BODY_WARP(props) {

	var p 				= props.props;

	const detail_HTML 		= (p.mode === 'detail') ? 	<C.SOURCES_BODY_DETAIL props={p} /> : null;
	const edit_HTML 		= (p.mode === 'edit') ? 	<C.SOURCES_BODY_EDIT props={p} /> : null;

	/*R.useEffect(()=>{

	}, []);*/

	return ( 
	
		<div className="item_warp item_warp_sources">

			<C.SOURCES_BODY_ROW props={p} />

			{detail_HTML}

			{edit_HTML}

		</div> 
		
	);

}

module.exports = C_SOURCES_BODY_WARP;