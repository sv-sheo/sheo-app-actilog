
try {

	// load CSS to webpack
	require('../../css/desktop/index.scss'); 

	global.APPSTART = new Date().getTime();
	global.M 		= require('./../common'); // common JS for all ss apps // legacy - here its only for actilog
	global.S        = require('./sheo'); // core app
	global.V        = require('./vendor');
	global._        = require("lodash");
	global.React    = require("react");
	global.Router   = require('react-router-dom'); 			// react router 4
	global.J    	= require("jotai"); 					// state management ... https://github.com/pmndrs/jotai
		   J.utils  = require("jotai/utils");
	global.A 		= {}; 									// a place to save all atom handles from jotai
	global.C        = require('./components');
	global.R        = require('./components/react');
	global.H        = require('./components/hooks');		// hooks
	global.IO_CLIENT= require("socket.io-client"); 
	global.E 		= new EventTarget(); 		// global custom events, 

	global.STATE 	= {};
	global.SOCKETS 	= {}; // all socket.io managers (of opened connections) ... usually only one
	global.WH       = {}; // WAREHOUSE - for stuff that is used often, changed seldom - a.k.a content (in fact its just here so that STORE is not a bigass object)
	global.IDB      = {}; // indexedDB
	global.URL 		= ''; // '<id>'   ... will be populated after react fetches data of this actilog

	//global.PRELOAD_DATA 	- filled in HTML (script tag with JSON) - for basic data like language,theme etc
	global.SERVER_DATA 		= {}; // fetched after DOM & JS load

	var local       		= {}; // for this JS file only
		local.ReactDOM  	= require("react-dom");

	var LOADED              = true;
	var LOADING_ERROR       = '';

	M.log.time('Main script loaded.'); // or M.log.error

} catch(e) {

	var LOADED          = false;
	var LOADING_ERROR   = e; //FAILED TO LOAD MAIN SCRIPT
	console.log('LOADING ERROR', e);

}

// fucking IE
if(window.COMPATIBLE && LOADED) {

	// AFTER DOM LOADED, BEFORE REACT
	S.other.ready.then(() => {

		//console.log('PRELOAD DATA', PRELOAD_DATA); // declared in HTML
		// catch any server errors from preload_data
		if(PRELOAD_DATA.error) {

			var server_error 		= new Error(PRELOAD_DATA.error);
				server_error.type 	= 'server';
			throw server_error;

		}

		return M.indexedDB.connect();

	// IndexDB started, getting content
	}).then(function(IndexedDB) {

		M.log.time('IndexedDB started.');

		IDB = IndexedDB; // populates SET and GET methods (async)
		// IDB.SET(name, value).then(callback)
		// IDB.GET(name).then(function(result) {})

		WH 	= 	S.other.populate_WH();
				S.events.init_custom_events();

		//return S.other.get_content(WH.db_version); // content will be stored in WH
		return Promise.resolve({ok: 1, text: "GOT CONTENT", data: {}});

	// CONNECT SOCKET
	}).then(async function(result) { 

		M.log.time(result.text);

		var socket_created 		= await M.socket.create('ACTILOG'); // create the main socket connection and save it to SOCKETS.MAIN // use M.socket.destroy('MAIN') to disconnect cleanly
		var socket_result 		= {ok: 0, text: '', data: {}};

		if( socket_created.ok) {

			var socket_initialized 	= await M.socket.listen_once('ACTILOG', 'INIT');

			if(socket_initialized.ok) {

				// fetch server data
				let test = await M.socket.execute('ACTILOG', 'ping', {action: 'ping'}, {return: true});

				if(test.ok) {

					socket_result.ok = 1;
					socket_result.text = 'Successfully pinged socket.';

				} else { socket_result.data = test; socket_result.text = 'Failed to fetch ping socket.'; }

			} else { socket_result.data = socket_initialized; socket_result.text = 'Failed to initialize socket.'; }

		} else { socket_result.data = socket_created; socket_result.text = 'Failed to connect to socket.' }
		
		if( !socket_result.ok ) M.log.error(socket_result, 'APP SOCKET ERROR');

		return socket_result

	// SETUP INITIAL STATE
	}).then(function(result) { 

		if(result.ok) { M.log.time(result.text); } else { M.log.error({id: '[e103]', message: 'Failed to connect to socket.'})};

		return S.other.setup_initial_state().catch(M.helpers.catch.bind(null, '[e102] Failed to setup initial state.'));;

	}).then(function(result) {

		M.log.time(result);

		return new Promise((resolve, reject) => {

			const DOM_ROOT  = document.getElementById('slock');
			const ROUTER    = Router.BrowserRouter; // https://reactrouter.com/docs/en/v6/getting-started/tutorial

			local.ReactDOM.render(

				<ROUTER><C.SIGNPOST /></ROUTER>,

				DOM_ROOT, 
				resolve
			);

		});

	// RENDERED REACT, running finishing touches
	}).then(function() {

		M.log.time('REACT RENDERED');

		// connect socket, if admin is logged in 
		//if(SERVER_DATA.admin) require('./admin');

	// ERROR    
	}).catch(function(e) { 

			e.type 		= e.type || 'bootup';
		var boot_error 	= require('./boot_error');
			boot_error.catch(e.type, e);

	});

} else {

	var error_type      	= !window.COMPATIBLE ? 'compatible' : 'loading';
	var error_object     	= window.COMPATIBLE_ERROR || LOADING_ERROR;

	var boot_error = require('./boot_error');
		boot_error.catch(error_type, error_object);

}

// ERROR_TYPES = [compatible, loading, bootup]

// STRING SIZE IN BYTES
//if(TextEncoder) { var string_size_in_bytes     = (new TextEncoder('utf-8').encode("string")).length;