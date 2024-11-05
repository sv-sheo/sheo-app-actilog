
function C_RIBBON_LANG_LINK(props) {

	function change_language() {

		props.set_lang(props.lang);
		props.change_mode();

		localStorage.language = props.lang;

		// save language in cookie via ajax
		const HTTP 		= new XMLHttpRequest();
		const lang_url	= WH.HOST+'set_lang?lang='+props.lang;

		HTTP.open("GET", lang_url); HTTP.send();

		//HTTP.onreadystatechange = function() { if(readyState === 4) (console.log(this.status+' '+this.statusText+' - '+this.responseText)); }

	  }

	return (
		
		<div className="rls_button" onClick={change_language}>{props.text}</div>
		
	);

}

module.exports = C_RIBBON_LANG_LINK;