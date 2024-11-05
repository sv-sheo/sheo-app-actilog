
module.exports = function(props) {

	// GLOBAL STATE
	const [sources, set_sources] 	= J.useAtom(A.sources);
	const [settings, set_settings] 	= J.useAtom(A.settings);
	const [section, set_section] 	= J.useAtom(A.section);

	R.useEffect(() => { if(section !== 'sources') set_section(props.section); }, []); // PROPS.SECTION is defined in root.jsx, differentt from ATOM.SECTION

	var ready = (section === 'sources') ? 1 : 0;

	return ready ? (
		
		<section className="section sources">

			<C.SOURCES_HEADER props={{sources, set_sources}} />

			<C.SOURCES_BODY props={{sources, set_sources, settings}} />

		</section>
		
	) : null;

}