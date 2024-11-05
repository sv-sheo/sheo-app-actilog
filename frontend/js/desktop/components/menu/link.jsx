
function C_MENU_LINK(props) {

	const [lang, set_lang] 	= J.useAtom(A.language);
	var text 				= props.data.texts[lang] || 'Unknown';
	var href 				= WH.APP_URL+props.data.href;

	return ( <R.NavLink className={({ isActive }) => isActive ? "menu_link ml_active" : "menu_link"} to={href}>
				
				<div className="ml_bg"></div>
				<span className="ml_text">{text}</span>

			</R.NavLink> );

}

module.exports = C_MENU_LINK;

//<R.Link to={props.data.href}>{text}</R.Link>,