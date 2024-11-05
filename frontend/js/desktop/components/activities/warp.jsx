function C_ACTIVITIES_WARP(props) {

	const [section, set_section] 	= J.useAtom(A.section);

	//set_section(props.section);

	return (
		
		<div>
			
			<R.Outlet />
			
		</div>
		
	);

}

module.exports = C_ACTIVITIES_WARP;