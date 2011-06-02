  var annotatedtimeline
  
  function initVis() {
	  annotatedtimeline = new google.visualization.AnnotatedTimeLine(
	          document.getElementById('visualization'));
  }
  
  var data = new google.visualization.DataTable();
  data.addColumn('date', 'Date');
  data.addColumn('number', 'Sold Pencils');
  data.addColumn('number', 'Sold Pens');
  data.addRows(6);
  data.setValue(0, 0, new Date(2008, 1 ,1,12,45,00));
  data.setValue(0, 1, 30000);
  data.setValue(0, 2, 40645);
  data.setValue(1, 0, new Date(2008, 1 ,1,12,45,01));
  data.setValue(1, 1, 14045);
  data.setValue(1, 2, 20374);
  data.setValue(2, 0, new Date(2008, 1 ,1,12,45,02));
  data.setValue(2, 1, 55022);
  data.setValue(2, 2, 50766);
  data.setValue(3, 0, new Date(2008, 1 ,1,12,45,03));
  data.setValue(3, 1, 75284);
  data.setValue(3, 2, 14334);
  data.setValue(4, 0, new Date(2008, 1 ,1,12,45,04));
  data.setValue(4, 1, 41476);
  data.setValue(4, 2, 66467);
  data.setValue(5, 0, new Date(2008, 1 ,1,12,45,05));
  data.setValue(5, 1, 33322);
  data.setValue(5, 2, 39463);
  
function drawVisualization() {
     
          annotatedtimeline.draw(data, {  'displayRangeSelector' : false,
          'zoomStartTime': new Date(2008, 1 ,1,12,44,05), //NOTE: month 1 = Feb (javascript to blame)
                                'zoomEndTime': data.getValue(data.getNumberOfRows()-1,0) //NOTE: month 1 = Feb (javascript to blame)
          });
    }

google.setOnLoadCallback(initVis);

function updateChartWithData() {
	data.insertRows(data.getNumberOfRows(),[[new Date(2008, 1 ,1,12,45,data.getNumberOfRows()),70000,60000]]);
	drawVisualization()
}

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

	
		interval = setInterval("refreshMarketChart()", 1000);

	} else {
		document.getElementById('chart_div').innerHTML = "market not found"
	}
};

function refreshMarketChart() {
	var newMarketData = getMarketPrices(marketId,marketPricesResponse);
	updateChartWithData(newMarketData);
}

function marketPricesResponse(obj) {
	document.getElementById('chart_div').innerHTML = marketName
			+ "</br></br>" + new Date().toLocaleTimeString() + "</br></br>"
			+ obj.text;
	gadgets.window.adjustHeight();
}