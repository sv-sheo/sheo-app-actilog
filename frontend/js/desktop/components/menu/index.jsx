
function C_MENU(props) {

	// GLOBAL STATE
	const [phase, set_phase] 	= J.useAtom(A.phase);

	// LOCAL STATE
	const [links, set_links] 	= R.useState([]);

	// generate menu links in correlation to phase
	R.useEffect(() => {

		var links_ = [];

		// show menu only in the accessible phase (not during loading and forbidden)
		if(phase === 'access') {

			_.forEach(S.other.menu_links, function(link_data, link_key) {

				links_.push(<C.MENU_LINK key={parseInt(link_key)} data={link_data} />)

			});

		} else { links_ = [ <C.MENU_LINK key={1} data={S.other.menu_links[1]} /> ] }

		set_links(links_);

	}, [phase]);



	return (
		
		<nav className="menu">

			<div className="menu_bg"></div>

			<div className="menu_warp">

			 	{ links }

			</div>

		</nav>
		
	);

}

module.exports = C_MENU;


//<C.MENU_LINK key={10} text="Přehled" href='/actilog/1' />