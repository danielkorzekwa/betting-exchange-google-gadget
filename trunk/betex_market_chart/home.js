// Get userprefs
var prefs = new gadgets.Prefs();
var timeWindow = 1000 * prefs.getInt("time_window_sec")
var data = []
var interval
var marketId = ""

// Read a page's GET URL variables and return them as an associative array.
function init(form) {
	data = []
	clearInterval(interval)
	marketId = form.marketIdInput.value
	getMarketDetails(marketId, marketDetailsCallback)

	function marketDetailsCallback(obj) {
		var jsonData = obj.data;

		if (jsonData.marketName) {

			var marketTime = new Date(jsonData.marketTime)
			var marketName = jsonData.eventName + " - " + pad(marketTime.getUTCHours(), 2) + ":"
					+ pad(marketTime.getUTCMinutes(), 2) + " " + jsonData.marketName

			for (i = 0; i < jsonData.runners.length; i++) {
				data.push({
					label : jsonData.runners[i].runnerName,
					data : []
				})
			}

			document.getElementById('chart_header_div').innerHTML = marketName
			refreshMarketChartTask()
			interval = setInterval("refreshMarketChartTask()", 1000);
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
	getMarketPrices(marketId, marketPricesCallback);

	function marketPricesCallback(obj) {
		var jsonData = obj.data;
		var now = new Date()
		updateMarketData(jsonData, now);
		plotChart(now)
		gadgets.window.adjustHeight()
	}
}

function updateMarketData(marketNode, now) {
	for (i = 0; i < marketNode.marketPrices.length; i++) {
		var value
		if (marketNode.marketPrices[i].bestToBackPrice) {
			value = marketNode.marketPrices[i].bestToBackPrice
			if (prefs.getString("data") == "Probability") {
				value = (1 / value)
			}
		} else
			value = 0
			
		var valueLabel = value
		if (prefs.getString("data") == "Probability") valueLabel = value.toFixed(3)
		data[i].label = data[i].label.split(": ")[0] + ": " + valueLabel

		// remove old data
		for (index in data[i].data) {
			if (now.getTime() - data[i].data[index][0] > timeWindow) {
				data[i].data.shift();
			} else {
				break;
			}
		}
		data[i].data.push([ now.getTime(), value ])
	}
}

function plotChart(now) {
	$.plot($("#chart_body_div"), data, {
		legend : {
			position : "nw",
			backgroundOpacity : 0
		},
		series : {
			shadowSize : 0
		},
		xaxis : {
			mode : "time",
			min : now - timeWindow,
			max : now.getTime()
		}
	});
}
