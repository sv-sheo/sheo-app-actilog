
// runs only ONCE, on init of root.jsx
function rows(section, data, ) {

	const [filter, set_filter] 		= J.useAtom(A.filter);
	const [filtered, set_filtered] 	= J.useAtom(A.filtered);

	const RUN_ON_FILTER_CHANGE		= [filter];

	const f 						= filter[section] || WH.filter.d;
	var new_filtered				= {...filtered};
		new_filtered[section]		= [];
	var nf 							= new_filtered[section];

	R.useEffect(() => {

		_.forEach(data, function(row, key) {

			if(filter.name === row.name) nf.push(row.id);

		});
console.log('tttttttttttttttttttt set filtered',)
		//set_filtered(new_filtered);

	}, RUN_ON_FILTER_CHANGE);

}

exports.rows = rows;
