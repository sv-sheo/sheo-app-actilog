
function C_RIBBON_LANG_SELECT(props) {

	let language_links = [];

	_.forEach(WH.languages.data, function(lang, lang_code) {

		language_links.push(<C.RIBBON_LANG_LINK key={lang_code} lang={lang_code} text={lang.text} set_lang={props.set_lang} change_mode={props.change_mode} />);

	});

	var class_name = "ribbon_language_select";
		class_name+= props.mode === "display" ? " rls_hidden" : " rls_visible";

	return (
		
		<div className={class_name}>

			<div className="rls_background"></div>

			<div className="rls_warp">

				{language_links}

			</div>

		</div>
		
	);

}

module.exports = C_RIBBON_LANG_SELECT;