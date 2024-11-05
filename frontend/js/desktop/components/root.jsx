
function ROOT() {

	let params 					= R.useParams();
	//const [alert, set_alert] 	= J.useAtom(A.alert);

	// Server alerts initialized in H.useFetch_actilog_data

	// download content
	H.useFetch_actilog_data();

	// RUN ON MOUNT
	R.useEffect(() => {

		//console.log('ON ROOT MOUNT ALERT');

	}, []);


	return (
		
		<div className="actilog">

			<C.RIBBON />

			<C.MENU />

			<main className="content">

				<R.Outlet />

			</main>

			<C.ALERT />

		</div>
		
	);

}

module.exports = ROOT;