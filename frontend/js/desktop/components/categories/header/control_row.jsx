
function C_CATEGORIES_HEADER_CONTROL(props) {

	// GLOBAL STATE
	const [lang, set_lang]			= J.useAtom(A.language);
	const [settings, set_settings]	= J.useAtom(A.settings);
	const [section, set_section] 	= J.useAtom(A.section);
	const [rights, set_rights] 		= J.useAtom(A.rights);

	// LOCAL STATE
	const [mode, set_mode] 			= R.useState("summaries"); // possible modes: summaries, add

	return ( 
	
		<div className="header_row control_row categories_control">

			<C.CATEGORIES_HEADER_SUMMARIES props={{lang, settings, section, mode, set_mode, rights}} />

			<C.CATEGORIES_HEADER_CONTROL_ADD props={{lang, mode, set_mode, settings, section, rights}} />
			
		</div> 
	
	);

}

module.exports = C_CATEGORIES_HEADER_CONTROL;