var interval
var marketId = ""
var marketName = ""
	
// Read a page's GET URL variables and return them as an associative array.
function init(form) {
	clearInterval(interval)
	marketId = form.marketIdInput.value
	var params = {};
	params[gadgets.io.RequestParameters.CONTENT_TYPE] = gadgets.io.ContentType.JSON;
	var url = "http://uk-api.betfair.com/www/sports/exchange/readonly/v1.0/bymarket?marketIds=1."
			+ marketId + "&types=EVENT,MARKET_DESCRIPTION&alt=json";
	gadgets.io.makeRequest(url, marketDetailsResponse, params);
}
function marketDetailsResponse(obj) {
	// obj.text contains the text of the page that was requested
	var jsonData = obj.data;
	var html = "";
	if (jsonData.eventTypes[0]) {
		var eventNode = jsonData.eventTypes[0].eventNodes[0];
		marketName = eventNode.event.eventName
				+ " - "
				+ eventNode.marketNodes[0].description.marketTime.split("T")[1]
						.split(":00")[0] + " "
				+ eventNode.marketNodes[0].description.marketName

		refreshMarketChart()
		interval = setInterval("refreshMarketChart()", 1000);

	} else {
		document.getElementById('chart_div').innerHTML = "market not found"
	}
};

function refreshMarketChart() {
	
	var params = {};
	params[gadgets.io.RequestParameters.CONTENT_TYPE] = gadgets.io.ContentType.JSON;
	var url = "http://uk-api.betfair.com/www/sports/exchange/readonly/v1.0/bymarket?marketIds=1."
			+ marketId + "&types=RUNNER_EXCHANGE_PRICES_BEST&alt=json&nocache=0";
	gadgets.io.makeRequest(url, marketPricesResponse, params);
	
	function marketPricesResponse(obj) {
		document.getElementById('chart_div').innerHTML = marketName + "</br></br>" + new Date().toLocaleTimeString() + "</br></br>" + obj.text;
		gadgets.window.adjustHeight();
	}
}
