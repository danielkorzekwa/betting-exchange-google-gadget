/**
 * This class represents sliding window chart. It allows for updating internally
 * stored time stamped data with new values. It removes automatically all values
 * older than timeWindowSec. It draws a chart for time stamped data.
 * 
 * Flot charting library is used by this class (http://code.google.com/p/flot/)
 * 
 * @author daniel.korzekwa
 * 
 * @param chartDivId
 *            Div element where chart is displayed.
 * @param timeWindowSec
 *            The size of time window for time stamped data to be displayed on a chart.
 */
function TimeWindowChart(chartDivId, timeWindowSec) {
	this.chartDivId = chartDivId
	this.timeWindowSec = timeWindowSec
	this.data = []
}

/**
 * Add new time series to a chart.
 * 
 * @param sieriesName
 *            Name of time series
 */
TimeWindowChart.prototype.addTimeSeries = function(seriesName) {
	this.data.push({
		label : seriesName,
		data : []
	})
}

/**
 * Add new time stamped data to a chart.
 * 
 * @param index
 *            Index of time series starting from 0.
 * @param time
 *            Time stamp for value to be added.
 * @param value
 *            New value to be added to a chart.
 */
TimeWindowChart.prototype.addData = function(index, time, value) {
	this.data[i].label = this.data[i].label.split(": ")[0] + ": " + value

	// remove old data
	for (index in this.data[i].data) {
		if (time.getTime() - this.data[i].data[index][0] > this.timeWindowSec) {
			this.data[i].data.shift();
		} else {
			break;
		}
	}

	this.data[i].data.push([ time.getTime(), value ])
}

/** Remove all time series from a chart. */
TimeWindowChart.prototype.clear = function() {
	this.data = []
}

/**
 * Plot chart to a div element provided to constructor of this chart.
 * 
 * @param time
 *            Current time.
 * 
 */
TimeWindowChart.prototype.plotChart = function(time) {
	$.plot($("#chart_body_div"), this.data, {
		legend : {
			position : "nw",
			backgroundOpacity : 0
		},
		series : {
			shadowSize : 0
		},
		xaxis : {
			mode : "time",
			min : time - this.timeWindowSec,
			max : time.getTime()
		}
	});
}
