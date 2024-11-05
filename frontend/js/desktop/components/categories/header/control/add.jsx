
function C_CATEGORIES_HEADER_CONTROL_ADD(props) {

	var p 			= props.props;

	return (p.mode === "add") ? ( 

		<div className="control_row_add categories_control_add">

			<C.FORMS_CATEGORY props={p} />

		</div>

	) : (<div style={{display: 'none'}}></div>);

}

module.exports = C_CATEGORIES_HEADER_CONTROL_ADD;