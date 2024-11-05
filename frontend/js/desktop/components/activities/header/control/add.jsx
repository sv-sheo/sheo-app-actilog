
function C_ACTIVITIES_HEADER_CONTROL_ADD(props) {

	var p 			= props.props;
		//p.state		= _.cloneDeep(WH.defaults.project_form);

	return (p.mode === "add") ? ( 

		<div className="control_row_add activities_control_add">

			<C.FORMS_ACTIVITY props={p} />

		</div>

	) : (<div style={{display: 'none'}}></div>);

}

module.exports = C_ACTIVITIES_HEADER_CONTROL_ADD;