
function C_RIBBON_ACCOUNT(props) {

	let navigate = R.useNavigate();
	let acc_link = WH.soul ? WH.site_host+'account' : WH.site_host+'login';
	let nick 	 = WH.soul ? WH.soul.nick : 'guest';

	return (
		
		<div className="ribbon_account">

			<a className="ra_warp" href={acc_link}>

				<div className="ra_avatar"><img className="ra_avatar_img" src="/files/get/icons/avatar_white.png" /></div>
				<div className="ra_nick">{nick}</div>

			</a>

		</div>
		
	);

}

module.exports = C_RIBBON_ACCOUNT;