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
		if (jsonData.eventTypes[0]) {
			var eventNode = jsonData.eventTypes[0].eventNodes[0];
			var marketName = eventNode.event.eventName + " - "
					+ eventNode.marketNodes[0].description.marketTime.split("T")[1].split(":00")[0] + " "
					+ eventNode.marketNodes[0].description.marketName

			for (i = 0; i < eventNode.marketNodes[0].runners.length; i++) {
				data.push({
					label : eventNode.marketNodes[0].runners[i].description.runnerName,
					data : []
				})
			}

			document.getElementById('chart_header_div').innerHTML = marketName
			refreshMarketChartTask()
			interval = setInterval("refreshMarketChartTask()", 1000);
		} else {
			document.getElementById('chart_header_div').innerHTML = "market not found"
		}
	}
}

function refreshMarketChartTask() {
	getMarketPrices(marketId, marketPricesCallback);

	function marketPricesCallback(obj) {
		var jsonData = obj.data;
		var now = new Date()
		var marketNode = jsonData.eventTypes[0].eventNodes[0].marketNodes[0];
		updateMarketData(marketNode, now);
		plotChart(now)
		gadgets.window.adjustHeight()
	}
}

function updateMarketData(marketNode, now) {
	for (i = 0; i < marketNode.runners.length; i++) {
		var value
		if (marketNode.runners[i].exchange.availableToBack) {
			value = marketNode.runners[i].exchange.availableToBack[0].price
			if (prefs.getString("data") == "Probability") {
				value = (1 / value).toFixed(2)
			}
		} else
			value = 0
		data[i].label = data[i].label.split(": ")[0] + ": " + value

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
