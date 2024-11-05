

function C_CHART_ITEM_MONTHLY_TIME_OVERVIEW(props) {

	var p 			= props.props;
	var data 		= props.data;
	var RECHARTS 	= V.recharts;
	var units 		= ' '+p.settings.units.time;

	//const [LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Brush, AreaChart, Area] = V.recharts;
	const theme_color 		= '#006341';

	function format_label(value, entry, index) { return p.l.charts[value]; }
	function format_tooltip(value, entry, index) { return [value+units, p.l.charts[entry]]; }

	return ( <div className="chi_warp chi_bixial_line">

				<div className="chi_header">{p.l.charts[p.chart_item]}</div>

				<div className="chi_content">

					<RECHARTS.ResponsiveContainer width="100%" height="100%">
						<RECHARTS.LineChart data={data} margin={{ top: 10, right: 20, left: 20, bottom: 5 }} >
							<RECHARTS.CartesianGrid strokeDasharray="3 3" />
							<RECHARTS.XAxis dataKey="name" />
							<RECHARTS.YAxis yAxisId="left_mto" unit={units} width={60} label={{ value: p.l.charts.time, angle: -90, position: 'left', offset: 10 }}/>
							<RECHARTS.YAxis yAxisId="right_mto" orientation="right"  unit={units} label={{ value: p.l.charts.eff_time, angle: -90, position: 'right', offset: 10 }} />
							<RECHARTS.Tooltip formatter={format_tooltip} />
							<RECHARTS.Legend verticalAlign="middle" formatter={format_label} />
							<RECHARTS.Line yAxisId="left_mto" type="monotone" dataKey="time" stroke={theme_color} strokeWidth={1} />
							<RECHARTS.Line yAxisId="right_mto" type="monotone" dataKey="eff_time" stroke={theme_color} strokeDasharray="4 4" />
						</RECHARTS.LineChart>
					</RECHARTS.ResponsiveContainer>

				</div>

			</div> );

}

module.exports = C_CHART_ITEM_MONTHLY_TIME_OVERVIEW;