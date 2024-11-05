
module.exports = function(props) {

	// GLOBAL STATE
	const [investors, set_investors] 	= J.useAtom(A.investors);
	const [settings, set_settings] 	= J.useAtom(A.settings);
	const [section, set_section] 	= J.useAtom(A.section);

	R.useEffect(() => { if(section !== 'investors') set_section(props.section); }, []); // PROPS.SECTION is defined in root.jsx, differentt from ATOM.SECTION

	var ready = (section === 'investors') ? 1 : 0;

	return ready ? (
		
		<section className="section investors">

			<C.INVESTORS_HEADER props={{investors, set_investors}} />

			<C.INVESTORS_BODY props={{investors, set_investors, settings}} />

		</section>
		
	) : null;

}