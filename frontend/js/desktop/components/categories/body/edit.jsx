
function C_CATEGORIES_BODY_EDIT(props) {

	var p = props.props;

	p.form_data = S.categories.format_category_for_form(p.category);

	R.useEffect(()=>{console.log('EDIT MOUNT')}, [])

	return ( 
	
		<div className="item_edit item_edit_categories">

			<C.FORMS_CATEGORY props={p} />

		</div> 
		
	);

}

module.exports = C_CATEGORIES_BODY_EDIT;