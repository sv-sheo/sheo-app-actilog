
function C_SOURCES_HEADER_CONTROL_ADD(props) {

	var p 			= props.props;

	return (p.mode === "add") ? ( 

		<div className="control_row_add sources_control_add">

			<C.FORMS_SOURCE props={p} />

		</div>

	) : (<div style={{display: 'none'}}></div>);

}

module.exports = C_SOURCES_HEADER_CONTROL_ADD;