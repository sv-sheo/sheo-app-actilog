

function C_CHART_ITEM_LINE_BIAXIAL(props) {

	var p 			= props.props;
	var data 		= props.data;
	var RECHARTS 	= V.recharts;
	var currency 	= WH.currencies[p.settings.units.currency];
	var units 		= {};
		units.time 	= ' '+p.settings.units.time;
		units.yield = ' '+currency.unit;

	//const [LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Brush, AreaChart, Area] = V.recharts;
	const theme_color 		= '#006341';

	function format_label(value, entry, index) { return p.l.charts[value]; }
	function format_tooltip(value, entry, index) { return [value+units[entry], p.l.charts[entry]]; }

	return ( <div className="chi_warp chi_bixial_line">

				<div className="chi_header">{p.l.charts[p.chart_item]}</div>

				<div className="chi_content">

					<RECHARTS.ResponsiveContainer width="100%" height="100%">
						<RECHARTS.LineChart data={data} margin={{ top: 10, right: 20, left: 20, bottom: 5 }} >
							<RECHARTS.CartesianGrid strokeDasharray="3 3" />
							<RECHARTS.XAxis dataKey="name" angle={-90} height={80} tickMargin={40} />
							<RECHARTS.YAxis yAxisId="left" unit={units.yield} width={60} label={{ value: p.l.charts.yield, angle: -90, position: 'left', offset: 10 }}/>
							<RECHARTS.YAxis yAxisId="right" orientation="right"  unit={units.time} label={{ value: p.l.charts.time, angle: -90, position: 'right', offset: 10 }} />
							<RECHARTS.Tooltip formatter={format_tooltip} />
							<RECHARTS.Legend verticalAlign="middle" formatter={format_label} />
							<RECHARTS.Line yAxisId="left" type="monotone" dataKey="yield" stroke={theme_color} strokeWidth={2} />
							<RECHARTS.Line yAxisId="right" type="monotone" dataKey="time" stroke={theme_color} strokeDasharray="4 4" />
						</RECHARTS.LineChart>
					</RECHARTS.ResponsiveContainer>

				</div>

			</div> );

}

module.exports = C_CHART_ITEM_LINE_BIAXIAL;