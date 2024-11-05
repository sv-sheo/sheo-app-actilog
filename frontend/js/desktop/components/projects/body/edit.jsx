
function C_PROJECTS_BODY_EDIT(props) {

	var p = props.props;

	p.form_data = S.projects.format_project_for_form(p.project);

	R.useEffect(()=>{console.log('EDIT MOUNT')}, [])

	return ( 
	
		<div className="item_edit item_edit_projects">

			<C.FORMS_PROJECT props={p} />

		</div> 
		
	);

}

module.exports = C_PROJECTS_BODY_EDIT;