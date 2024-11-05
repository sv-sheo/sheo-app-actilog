
function C_ALERT(props) {

	const [alert, set_alert] 	= J.utils.useReducerAtom(A.alert, S.other.reducers.alert);

	// ON MOUNT, if there is no active alert, but there are alerts in queue, open first alert
	R.useEffect(() => { set_alert({type:'open_next_in_queue'}); }, []);

	// if there is a new active alert, and it has an auto_close, set timeout for it to close
	R.useEffect(() => { 

		if(alert.active && alert.active.auto_close) {

			// set the timeout only if it hasnt been set yet
			if( !alert.close_timeout) {

				var to = window.setTimeout(function() { set_alert({type:'close'}); }, alert.active.auto_close);

				set_alert({type:'set_close_timeout', close_timeout: to}); 

			}

		}
	
	}, [alert.active]);

	function close_alert() { S.alert.close({set_alert}); }

	return alert.active ? (<C.ALERT_BOX alert={alert.active} close_alert={close_alert} />) : null;

}

module.exports = C_ALERT;