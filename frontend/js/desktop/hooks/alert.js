
function run_query() {

	const [alert, set_alert] 	= J.useAtom(A.alert);
	const RUN_ON_ALERT_CHANGE 	= [alert];

	const [test, set_test] = R.useState(alert);

	console.log('run querryexecution');

	R.useEffect(() => {

console.log('run querry USE EFFECT')

		// there are some alerts, display them
		if(alert.queue.length) {

console.log('THERE IS SOMETHING IN QUEUE', alert);

			var alert_id 	= alert.queue[0]; // show first in queue

			alert.active = alert.alerts[alert_id] || null;

			//set_alert(alert);
			set_test(alert);

			// self close in 5 seconds
			if(true) { window.setTimeout(function() { S.alert.close(alert); }, 5000); }

		}

	}, RUN_ON_ALERT_CHANGE);

	//return alert;
	return test;

	/*R.useEffect(() => {

console.log('fffffffffffffffffffffffffff ALERTS QUEUE CHANGED', alerts_queue, alert_active);

		// get first alert from the queue
		var alerts_keys 	= Object.keys(alerts_queue);

		// there are some alerts, display them
		if(alerts_keys.length) {

			var id_to_show	= (id && alerts_keys[id]) ? id : 0;
			var alert_id 	= alerts_keys[id_to_show];
			var alert		= alerts_queue[alert_id];

			set_active_alert(alert);

			// self close in 5 seconds
			if(true) {

				window.setTimeout(function() { 
					
					S.alert.close({alert_active: alert, alerts_queue, set_alerts_queue, set_active_alert})

				 }, 5000);

			}

		// no more alerts, destroy it
		} else { 
			
			set_active_alert(false); 
		
		}

	}, RUN_ON_ALERTS_QUEUE_CHANGE);

	return alert_active;*/

}

exports.run_query = run_query;