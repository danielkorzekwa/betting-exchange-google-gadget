// Get userprefs
var prefs = new gadgets.Prefs();
var timeWindow = 1000 * prefs.getInt("time_window_sec")
var refreshMarketTask
var marketId = ""
var timeWindowChart = new TimeWindowChart("#chart_body_div", timeWindow)
var probType = null

// Read a page's GET URL variables and return them as an associative array.
function init(form) {

	clearInterval(refreshMarketTask)
	timeWindowChart.clear()
	marketId = form.marketIdInput.value
	probType = null
	getMarketDetails(marketId, marketDetailsCallback)

	function marketDetailsCallback(obj) {
		var marketJson = obj.data;

		if (marketJson.marketName) {

			var chartHeaderHtml = createMarketHeaderHtml(marketJson)
			document.getElementById('chart_header_div').innerHTML = chartHeaderHtml

			/** Action listener on changing probability type. */
			var selectmenu = document.getElementById("probTypeMenu")
			selectmenu.onchange = function() {
				var chosenOption = this.options[this.selectedIndex]
				probType = chosenOption.value
				timeWindowChart.clearValues()
			}

			/** Add market runners to market chart. */
			for (i in marketJson.runners) {
				timeWindowChart.addTimeSeries(marketJson.runners[i].runnerName)
			}

			refreshMarketChartTask()
			refreshMarketTask = setInterval("refreshMarketChartTask()", 1000);
		} else {
			document.getElementById('chart_header_div').innerHTML = "Market not found."
			document.getElementById('chart_body_div').innerHTML = ""
		}
	}

}

function refreshMarketChartTask() {
	getMarketProbability(marketId, marketProbabilityCallback, probType);

	function marketProbabilityCallback(obj) {
		var marketNode = obj.data;
		var now = new Date()
		for (i in marketNode.probabilities) {
			var value = marketNode.probabilities[i].probability
			timeWindowChart.addData(i, now, value)
		}
		timeWindowChart.plotChart(now)
		gadgets.window.adjustHeight()
	}
}

function createMarketHeaderHtml(marketJson) {
	var marketTime = new Date(marketJson.marketTime)
	var marketName = marketJson.eventName + " - " + pad(marketTime.getUTCHours(), 2) + ":"
			+ pad(marketTime.getUTCMinutes(), 2) + " " + marketJson.marketName

	var chartHeaderHtml = ''

	chartHeaderHtml += 'Market name: ' + marketName
	chartHeaderHtml += ', num of winners: ' + marketJson.numOfWinners

	chartHeaderHtml += '</br>'
	chartHeaderHtml += 'Probability type: '
	chartHeaderHtml += '<select id="probTypeMenu" size="1">'
	if (marketJson.numOfWinners == 1) {
		chartHeaderHtml += '<option value="WIN" selected="selected">WIN (single winner market)</option>'
		chartHeaderHtml += '<option value="PLACE" >PLACE (two winners market)</option>'
		chartHeaderHtml += '<option value="SHOW" >SHOW (three winners market)</option>'

	} else if (marketJson.numOfWinners == 2) {
		chartHeaderHtml += '<option value="PLACE" >PLACE (two winners market)</option>'
	} else if (marketJson.numOfWinners >= 3) {
		chartHeaderHtml += '<option value="SHOW" >SHOW (three winners market)</option>'
	} else 
		alert('Unsupported number of winners =' + marketJson.numOfWinners)
	
	chartHeaderHtml += '</select>'
	return chartHeaderHtml
}

function pad(number, length) {

	var str = '' + number;
	while (str.length < length) {
		str = '0' + str;
	}
	return str;
}