

function C_CHART_LINK(props) {

	var p 					= props.props;

	function change_handler(e) {

		var new_chart_list = _.cloneDeep(p.chart_list)
			new_chart_list[p.chart_item] = e.currentTarget.checked ? 1 : 0;

		p.set_chart_list(new_chart_list);

	}

	return ( <div className="charts_menu_link">
				
				<label>

					<input type="checkbox" name="chart_item" value={p.chart_item} checked={p.on_off ? true : false} onChange={change_handler} />
					<span className="cml_text">{p.l.charts[p.chart_item]}</span>

				</label>

			</div> );

}

module.exports = C_CHART_LINK;

//<R.Link to={props.data.href}>{text}</R.Link>,