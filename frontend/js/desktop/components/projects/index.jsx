

module.exports = function(props) {

	// GLOBAL STATE
	const [projects, set_projects] 	= J.useAtom(A.projects);
	const [settings, set_settings] 	= J.useAtom(A.settings);
	const [section, set_section] 	= J.useAtom(A.section);

	R.useEffect(() => { if(section !== 'projects') set_section(props.section); }, []); // PROPS.SECTION is defined in root.jsx, differentt from ATOM.SECTION

	var ready = (section === 'projects') ? 1 : 0;

	return ready ? (
		
		<section className="section projects">

			<C.PROJECTS_HEADER props={{projects, set_projects}} />

			<C.PROJECTS_BODY props={{projects, set_projects, settings}} />

		</section>
		
	) : null;

}