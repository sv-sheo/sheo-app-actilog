
exports.filter = function(old_state, action) { /* action = {section, column, filter, type}    type = 'full' : 'single' */

	var new_state = {...old_state};

	if(action.type === 'full') {

		new_state = action.filter;

	} else {

		if(action.section && WH.sections[action.section]) {

			if(action.column) {

				if( !_.isUndefined(action.filter)) {

					new_state[action.section][action.column] = action.filter;

				} else { M.log.error('[actilog_filtr_03] New filter value cannot be undefined.')}

			} else { M.log.error('[actilog_filtr_02] Missing filter column.')}

		} else { M.log.error('[actilog_filtr_01] Invalid filter section.')}

	}

	return new_state;

}


exports.form = function(old_state, action) { /* action = {type, field, value_object}    type = 'input' : 'submit'; value_object: {value, valid: <bool>, text: '', error: ''} */

	var new_state = {...old_state};

	if(action.type === 'first_submit_try') new_state.state.first_submit_tried = 1;

	if(action.type === 'set_phase') new_state.state.phase = action.phase || 'input';

	if(action.type === 'input') {

		var field_list = Object.keys(new_state.fields);

		if(action.field && M.helpers.is_in_array(action.field, field_list)) {

			new_state.fields[action.field] = action.value_object;

			var overall = S.other.forms.get_overall_state(new_state.fields);

			new_state.state.valid 	= overall.valid;
			//new_state.state.errors 	= overall.errors;

		} else { M.log.error('[actilog_form_01] Invalid form field.'); }

	}

	if(action.type === 'set_errors') {

		let text 	= action.result?.id + ' ' + action.result?.text; // socket result
		let errors	= action.result?.errors || [];

		let err_array = [text, ...errors];

		new_state.state.errors = err_array;

	}

	return new_state;

}

exports.settings_form = function(old_state, action) { /* action = {type, field, value_object} */

	var new_state = _.cloneDeep(old_state);

	if(action.type === 'input') {

		var field_list = Object.keys(new_state.fields);

		if(action.field && M.helpers.is_in_array(action.field, field_list)) {

			action.value_object.original_value = old_state.fields[action.field].value; // save previous value in case DB update fails

			new_state.fields[action.field] = action.value_object;

		} else { M.log.error('[actilog_settings_form_01] Invalid form field.'); }

	}

	return new_state;

}

exports.settings_remote = function(old_state, action) { /* action = {type, field, value_object} */

	var new_state = _.cloneDeep(old_state);

	if(action.type === 'set_timeout') { new_state.timeout = action.timeout; }

	if(action.type === 'set_sending') {

		new_state.sending = action.sending ? 1 : 0;
		
		// if sending is being turned off, turn on sent
		new_state.sent = action.sending ? 0 : 1;

	}

	if(action.type === 'set_remote') { 

		new_state = {...new_state, ...action.result};

	 }

	 if(action.type === 'set_sent_off') { 
		
		new_state.sent = 0;
		new_state.result = {};

	 }

	return new_state;

}

exports.alert = function(old_state, action) {

	var new_state = _.cloneDeep(old_state);

	// adds alert to queue, if there is no active alert, open the first alert in queue
	if(action.type === 'add_to_queue') {

		if(action.alert && action.alert.id) {

			var alert_to_add = action.alert;

			// make sure new alert has unique id
			if(new_state.alerts[alert_to_add.id]) alert_to_add.id = alert_to_add.id + M.helpers.random_alpha_numeric(3, 'alpha');

			new_state.alerts[alert_to_add.id] = alert_to_add;
			new_state.queue.push(alert_to_add.id)

			//console.log('ALERT '+alert_to_add.id+' HAS BEEN ADDED TO QUEUE ('+new_state.queue.join(',')+') QUEUE: '+new_state.queue.join(','));

			// if there is no active alert, open the first alert in queue
			if(!new_state.active && new_state.queue.length) {

				var next_alert_id = new_state.queue.shift();

				if(new_state.alerts[next_alert_id]) {
					
					new_state.active = _.cloneDeep(new_state.alerts[next_alert_id]);
					delete new_state.alerts[next_alert_id];
	
					//console.log('[QUEUE] Opened next alert in queue: ('+new_state.active.id+'), QUEUE: '+new_state.queue.join(','));
	
				}

			}

		}

	}

	// closes active alert and opens a new one
	if(action.type === 'open') {

		if(action.alert && action.alert.id) {

			//if(old_state.active) console.log('Closing alert ('+old_state.active.id+')');

			// reset close timeout if there is any
			if(old_state.close_timeout) { window.clearTimeout(old_state.close_timeout); new_state.close_timeout = 0; }

			new_state.active = action.alert;

			//console.log('Opened alert ('+new_state.active.id+') QUEUE: '+new_state.queue.join(','));

		}

	}

	// closes active alert and opens next in queue (if there is any)
	if(action.type === 'open_next_in_queue') {

		if(new_state.queue.length) {

			var next_alert_id = new_state.queue.shift();

			if(new_state.alerts[next_alert_id]) {

				//if(old_state.active) console.log('Closing alert ('+old_state.active.id+')');
				
				new_state.active = _.cloneDeep(new_state.alerts[next_alert_id]);
				delete new_state.alerts[next_alert_id];

				// console.log('Opened next alert in queue: ('+new_state.active.id+'), QUEUE: '+new_state.queue.join(','), new_state.active);

			}

		} else { /* console.log('There are no alerts in queue to be opened.') */ }

	}


	// closes active alert and opens next in queue (if there is any)
	if(action.type === 'close') {

		new_state.active = null;

		//if(old_state.active) console.log('[close] Closed alert ('+old_state.active.id+')');

		// reset close timeout if there is any
		if(old_state.close_timeout) new_state.close_timeout = 0;

		// open next in queue (if there is any)
		if(new_state.queue.length) {

			var next_alert_id = new_state.queue.shift();

			if(new_state.alerts[next_alert_id]) {
			
				new_state.active = _.cloneDeep(new_state.alerts[next_alert_id]);
				delete new_state.alerts[next_alert_id];

				// console.log('[close] Opened next alert in queue: ('+new_state.active.id+'), QUEUE: '+new_state.queue.join(','));

			}

		} else { /* console.log('[close] There are no alerts in queue to be opened.') */ }

	}

	if(action.type === 'set_close_timeout') {

		if(old_state.close_timeout) window.clearTimeout(old_state.close_timeout);

		if(action.close_timeout) {

			// console.log('Set alert ('+old_state.active.id+') to be closed in '+(Math.round(+old_state.active.auto_close/1000))+' seconds');
			new_state.close_timeout = action.close_timeout;

		} else { new_state.close_timeout = 0; }

	}

	return new_state;

}