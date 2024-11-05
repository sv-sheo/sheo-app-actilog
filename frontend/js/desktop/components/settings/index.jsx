
module.exports = function(props) {

	// GLOBAL STATE
	const [lang, set_lang] 			= J.useAtom(A.language);
	const [section, set_section] 	= J.useAtom(A.section);
	const [settings, set_settings] 	= J.useAtom(A.settings);

	R.useEffect(() => { if(section !== 'settings') set_section(props.section); }, []); // PROPS.SECTION is defined in root.jsx, differentt from ATOM.SECTION

	var ready = (section === 'settings' && Object.keys(settings).length) ? 1 : 0; // render settings only ever after loading settings from server and section being set to settings

	return ready ? (
		
		<section className="section settings">

			<C.SETTINGS_HEADER props={{lang}} />

			<C.SETTINGS_BODY props={{settings, set_settings, lang}} />

		</section>
		
	) : null;

}