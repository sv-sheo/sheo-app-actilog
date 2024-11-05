
function C_INVESTORS_BODY_EDIT(props) {

	var p = props.props;

	p.form_data = S.investors.format_investor_for_form(p.investor);

	R.useEffect(()=>{console.log('EDIT MOUNT')}, [])

	return ( 
	
		<div className="item_edit item_edit_investors">

			<C.FORMS_INVESTOR props={p} />

		</div> 
		
	);

}

module.exports = C_INVESTORS_BODY_EDIT;