
// catch boot error (COMPATIBLE | NOT LOADED | BOOT | SERVER)
exports.catch = function(type, error) {

	type = type ? type : 'preload'; 						// compatible | bootup | loading | server
	error= error || new Error('UNKNOWN PRELOAD ERROR'); 	// error = Instance of Error 

	console.log('%c '+type.toUpperCase()+' ERROR: '+error.message, 'color: red; font-weight:bold;');

	// show the error when the DOM is ready
	document.onreadystatechange = function() {

		// might run twice, but its ok
		if(document.readyState === 'interactive' || document.readyState === 'complete') {

			// get language
			var WH 			= WH || {};
			var WH_ 		= WH || {};
			var PD_ 		= PRELOAD_DATA || {};
			var LS 			= localStorage || {};
			var languages 	= {cz: 1, en: 1, de: 1};
			var language    = LS.language || WH_.language || PD_.language || navigator.language || 'en';
				language 	= language.split('-')[0]; // some browsers return 'en-GB' format of language
				language    = languages[language] ? language : 'en';

				console.log('Language from: [localStorage = '+LS.language+'], [WH = '+WH_.language+'], [PRELOAD_DATA = '+PD_.language+'], [navigator = '+navigator.language+']');

			var texts_       = {
								cz: {
										header: 		'CHYBA',
										bootup: 		'Při načítání stránky se stala chyba: '+error.message+'<br>Kontaktujte prosím správce (sheo.vetesia@gmail.com).',
										compatible: 	'Váš prohlížeč je příliš zastaralý a nedokáže zobrazit tuto stránku.<br>V zájmu vašeho estetického cítění i kybernetické bezpečnosti si prosím Váš prohlížeč aktualizujte, nebo kontaktujte správce (sheo.vetesia@gmail.com).',
										loading: 		'Při načítání stránky se stala chyba: '+error.message+'<br>Kontaktujte prosím správce (sheo.vetesia@gmail.com).',
										preload: 		'Neznámá chyba: '+error.message+'<br>Kontaktujte prosím správce (sheo.vetesia@gmail.com).',
									},
								en: {
										header: 		'ERROR',
										bootup: 		'Error during loading this page: '+error.message+'<br>Please contact the administrator (sheo.vetesia@gmail.com).',
										compatible: 	'Your browser is too old to be supported.<br>In your best interest, we urge you to install and use a better alternative or contact the administrator (sheo.vetesia@gmail.com).', 
										loading: 		'Error during loading this page: '+error.message+'<br>Please contact the administrator (sheo.vetesia@gmail.com).',
										preload: 		'Unknown error: '+error.message+'<br>Please contact the administrator (sheo.vetesia@gmail.com).',
									},
								de: {
										header: 		'FEHLER',
										bootup: 		'Beim Laden der Seite ist ein Fehler aufgetreten: '+error.message+'<br>Bitte kontaktieren Sie den Administrator.',
										compatible: 	'Ihr Browser ist zu alt und wird nicht unterstützt.<br>In Ihrem Interesse empfehlen wir Ihnen, eine bessere Alternative zu installieren und zu verwenden oder wenden Sie sich an den Administrator(sheo.vetesia@gmail.com). ',
										loading: 		'Beim Laden der Seite ist ein Fehler aufgetreten: '+error.message+'<br>Bitte kontaktieren Sie den Administrator (sheo.vetesia@gmail.com).',
										preload: 		'Unbekannter Fehler: '+error.message+'<br>Bitte kontaktieren Sie den Administrator (sheo.vetesia@gmail.com).',
									},
							};

			if(type === 'server') {

				var DOM_header    	= document.getElementById('no_js_header');
				var DOM_text       	= document.getElementById('no_js_text');

				DOM_header.innerHTML= error.message;
				DOM_text.innerHTML	= '';

			// COMPATIBLE and other errors
			} else {

				var texts = texts_[language];

				var DOM_header            = document.getElementById('no_js_header');
				var DOM_text              = document.getElementById('no_js_text');
					DOM_header.innerHTML  = texts.header;
					DOM_text.innerHTML    = texts[type];

				var fallback_host = 'https://s.sheo.cz';
				var query         = location.search ? location.search : '?a=a';
				var fallback_url  = location.pathname;
					fallback_url += query + '&fallback_error='+type+'&error='+encodeURI(error.message);
					fallback_url += location.hash;

				//if( !(/no_fallback=1/gi.test(query)) ) location.replace(fallback_host+fallback_url);
				//console.log('FALLBACK TO ' + fallback_host+fallback_url);

			}

		}

	};

}