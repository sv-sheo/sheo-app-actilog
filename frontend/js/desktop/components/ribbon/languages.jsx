
function C_RIBBON_LANGUAGES(props) {

	const [lang, set_lang] 	= J.useAtom(A.language);
	const [mode, set_mode] 	= R.useState("display");
	
	const mode_switch 		= {display: 'select', select: 'display'};
	const mode_style 		= {display: '40px', select: 'auto'};

	function change_mode() { set_mode(mode_switch[mode]); }

	return (
		
		<div className="ribbon_languages" style={{height: mode_style[mode]}}>

			<div className="rl_current_language" onClick={change_mode}>

				<div className="ra_avatar"><img className="ra_avatar_img" src="/files/get/icons/globe_white.png" /></div>
				<div className="ra_nick">{WH.languages[lang]}</div>

			</div>

			<C.RIBBON_LANG_SELECT set_lang={set_lang} mode={mode} change_mode={change_mode} />

		</div>
		
	);

}

module.exports = C_RIBBON_LANGUAGES;