
function C_PROJECTS_BODY_WARP(props) {

	var p 				= props.props;
	//var default_mode	= p.mode === 'detail' ? 'detail' : 'row';

	// LOCAL STATE
	//const [mode, set_mode] = R.useState(default_mode); // possible modes: row, detail, edit

	//var props_ = {...p, mode, set_mode};

	const detail_HTML 		= (p.mode === 'detail') ? 	<C.PROJECTS_BODY_DETAIL props={p} /> : null;
	const edit_HTML 		= (p.mode === 'edit') ? 	<C.PROJECTS_BODY_EDIT props={p} /> : null;

	R.useEffect(()=>{

		/*if(p.project.id === 3) {
			
			set_mode('detail');

			console.log('opening detail', p.project);

		}*/

	}, []);

	//R.useEffect(()=>{  }, [p.mode])

	return ( 
	
		<div className="item_warp item_warp_projects">

			<C.PROJECTS_BODY_ROW props={p} />

			{detail_HTML}

			{edit_HTML}

		</div> 
		
	);

}

module.exports = C_PROJECTS_BODY_WARP;