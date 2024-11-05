

function C_CHART_ITEM_PIE(props) {

	var p 					= props.props;
	var data 				= props.data;
	var RECHARTS 			= V.recharts;
	var units 				= {};
		units.time 			= ' '+p.settings.units.time;

	const COLORS 			= ['#006341', "#0088FE", "#00C49F", "#FFBB28", "#d9534f", "#681a9c", "#333333", "#5c351d"];
	const RADIAN 			= Math.PI / 180;

	/*var data = [

		{name: 'A', yield: 1000, time: 5},
		{name: 'B', yield: 600, time: 2},
		{name: 'C', yield: 2200, time: 11},
		{name: 'D', yield: 2500, time: 10},
		{name: 'E', yield: 1800, time: 6},
		{name: 'F', yield: 1200, time: 6},
		{name: 'G', yield: 1000, time: 5},
		{name: 'H', yield: 400, time: 2},
		{name: 'I', yield: 600, time: 2},

	];*/

	function render_custom_label({ value, cx, cy, midAngle, innerRadius, outerRadius, percent, index }) {

		const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
		const x 	= cx + radius * Math.cos(-midAngle * RADIAN);
		const y 	= cy + radius * Math.sin(-midAngle * RADIAN);
		//var text 	= value+' '+units.time;
		var text 	= (Math.round(percent*100))+' %';

		//console.log('EEEEEEEEEEE', arguments)

		return (<text x={x} y={y} fill="white" style={{fontSize: '10px'}} textAnchor={x > cx ? 'start' : 'end'} dominantBaseline="central">{text}</text>);

	};

	function label_format(val) { return (val + ' ' + units.time); }

	return ( <div className="chi_warp chi_bixial_line">

				<div className="chi_header">{p.l.charts[p.chart_item]}</div>

				<div className="chi_content">

					<RECHARTS.ResponsiveContainer width="100%" height="100%">
						<RECHARTS.PieChart >
							<RECHARTS.Pie
								data={data}
								dataKey="time"
								nameKey="name"
								cx="50%"
								cy="50%"
								labelLine={false}
								label={render_custom_label}
								innerRadius={0}
								outerRadius={80}
								fill='#006341'
								legendType="circle"
								isAnimationActive={true}
								
							>
								{data.map((entry, index) => ( <RECHARTS.Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} /> ))}

							</RECHARTS.Pie>
							<RECHARTS.Legend verticalAlign="bottom" />
							<RECHARTS.Tooltip formatter={label_format}/>
						</RECHARTS.PieChart>
					</RECHARTS.ResponsiveContainer>

				</div>

			</div> );

}

module.exports = C_CHART_ITEM_PIE;

// comes inside Pie
/* <RECHARTS.LabelList dataKey="yield" position="inside" style={{fontSize: '8px', fontWeight: 'normal', color: "#ffff00"}} formatter={label_format} />*/