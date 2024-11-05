
module.exports = function(props) {

	// GLOBAL STATE
	const [categories, set_categories] 	= J.useAtom(A.categories);
	const [settings, set_settings] 	= J.useAtom(A.settings);
	const [section, set_section] 	= J.useAtom(A.section);

	R.useEffect(() => { if(section !== 'categories') set_section(props.section); }, []); // PROPS.SECTION is defined in root.jsx, differentt from ATOM.SECTION

	var ready = (section === 'categories') ? 1 : 0;

	return ready ? (
		
		<section className="section categories">

			<C.CATEGORIES_HEADER props={{categories, set_categories}} />

			<C.CATEGORIES_BODY props={{categories, set_categories, settings}} />

		</section>
		
	) : null;

}