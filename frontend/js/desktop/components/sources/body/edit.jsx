
function C_SOURCES_BODY_EDIT(props) {

	var p = props.props;

	p.form_data = S.sources.format_source_for_form(p.source);

	R.useEffect(()=>{console.log('EDIT MOUNT')}, [])

	return ( 
	
		<div className="item_edit item_edit_sources">

			<C.FORMS_SOURCE props={p} />

		</div> 
		
	);

}

module.exports = C_SOURCES_BODY_EDIT;