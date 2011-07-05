// Get userprefs
var prefs = new gadgets.Prefs();
var timeWindow = 1000 * prefs.getInt("time_window_sec")
var refreshMarketTask
var marketId = ""
var timeWindowChart = new TimeWindowChart("#chart_body_div",timeWindow)

// Read a page's GET URL variables and return them as an associative array.
function init(form) {
	
	clearInterval(refreshMarketTask)
	timeWindowChart.clear()
	marketId = form.marketIdInput.value
	getMarketDetails(marketId, marketDetailsCallback)

	function marketDetailsCallback(obj) {
		var jsonData = obj.data;

		if (jsonData.marketName) {

			var marketTime = new Date(jsonData.marketTime)
			var marketName = jsonData.eventName + " - " + pad(marketTime.getUTCHours(), 2) + ":"
					+ pad(marketTime.getUTCMinutes(), 2) + " " + jsonData.marketName

			for (i in jsonData.runners) {
				timeWindowChart.addTimeSeries(jsonData.runners[i].runnerName)
			}

			document.getElementById('chart_header_div').innerHTML = marketName
			refreshMarketChartTask()
			refreshMarketTask = setInterval("refreshMarketChartTask()", 1000);
		} else {
			document.getElementById('chart_header_div').innerHTML = "Market not found."
				document.getElementById('chart_body_div').innerHTML = ""
		}
	}

	function pad(number, length) {

		var str = '' + number;
		while (str.length < length) {
			str = '0' + str;
		}
		return str;
	}
}

function refreshMarketChartTask() {
	getMarketProbability(marketId, marketProbabilityCallback);

	function marketProbabilityCallback(obj) {
		var marketNode = obj.data;
		var now = new Date()
		for (i in marketNode.probabilities) {
			var value = marketNode.probabilities[i].probability	
			timeWindowChart.addData(i, now,value)
		}
		timeWindowChart.plotChart(now)
		gadgets.window.adjustHeight()
	}
}