
function C_INVESTORS_HEADER_CONTROL_ADD(props) {

	var p 			= props.props;

	return (p.mode === "add") ? ( 

		<div className="control_row_add investors_control_add">

			<C.FORMS_INVESTOR props={p} />

		</div>

	) : (<div style={{display: 'none'}}></div>);

}

module.exports = C_INVESTORS_HEADER_CONTROL_ADD;