
function C_ACTIVITIES_BODY_EDIT(props) {

	var p = props.props;

	p.form_data = S.activities.format_activity_for_form(p.activity);
	
	R.useEffect(()=>{console.log('EDIT MOUNT')}, [])

	return ( 
	
		<div className="item_edit item_edit_activities">

			<C.FORMS_ACTIVITY props={p} />

		</div> 
		
	);

}

module.exports = C_ACTIVITIES_BODY_EDIT;