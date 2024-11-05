
function C_CATEGORIES_BODY_WARP(props) {

	var p 				= props.props;

	const detail_HTML 		= (p.mode === 'detail') ? 	<C.CATEGORIES_BODY_DETAIL props={p} /> : null;
	const edit_HTML 		= (p.mode === 'edit') ? 	<C.CATEGORIES_BODY_EDIT props={p} /> : null;

	/*R.useEffect(()=>{

	}, []);*/

	return ( 
	
		<div className="item_warp item_warp_categories">

			<C.CATEGORIES_BODY_ROW props={p} />

			{detail_HTML}

			{edit_HTML}

		</div> 
		
	);

}

module.exports = C_CATEGORIES_BODY_WARP;