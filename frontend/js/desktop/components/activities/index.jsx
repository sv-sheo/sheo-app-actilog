


module.exports = function(props) {

	// GLOBAL STATE
	const [activities, set_activities] 	= J.useAtom(A.activities);
	const [settings, set_settings] 	= J.useAtom(A.settings);
	const [section, set_section] 	= J.useAtom(A.section);

	R.useEffect(() => { if(section !== 'activities') set_section(props.section); }, []); // PROPS.SECTION is defined in root.jsx, differentt from ATOM.SECTION

	var ready = (section === 'activities') ? 1 : 0;

	return ready ? (
		
		<section className="section activities">

			<C.ACTIVITIES_HEADER props={{activities, set_activities}} />

			<C.ACTIVITIES_BODY props={{activities, set_activities, settings}} />

		</section>
		
	) : null;

}