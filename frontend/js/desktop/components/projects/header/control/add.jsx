
function C_PROJECTS_HEADER_CONTROL_ADD(props) {

	var p 			= props.props;
		//p.state		= _.cloneDeep(WH.defaults.project_form);

	return (p.mode === "add") ? ( 

		<div className="control_row_add projects_control_add">

			<C.FORMS_PROJECT props={p} />

		</div>

	) : (<div style={{display: 'none'}}></div>);

}

module.exports = C_PROJECTS_HEADER_CONTROL_ADD;