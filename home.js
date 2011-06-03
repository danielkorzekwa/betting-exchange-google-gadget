var annotatedtimeline
function initChart() {
	annotatedtimeline = new google.visualization.AnnotatedTimeLine(document.getElementById('chart_body_div'));
}
google.setOnLoadCallback(initChart);

var data
var interval
var marketId = ""

// Read a page's GET URL variables and return them as an associative array.
function init(form) {

	clearInterval(interval)
	marketId = form.marketIdInput.value
	getMarketDetails(marketId, marketDetailsCallback)

	function marketDetailsCallback(obj) {
		// obj.text contains the text of the page that was requested
		var jsonData = obj.data;
		if (jsonData.eventTypes[0]) {
			var eventNode = jsonData.eventTypes[0].eventNodes[0];
			var marketName = eventNode.event.eventName + " - "
					+ eventNode.marketNodes[0].description.marketTime.split("T")[1].split(":00")[0] + " "
					+ eventNode.marketNodes[0].description.marketName

			data = new google.visualization.DataTable();
			data.addColumn('datetime', 'Date');
			for(i =0;i<20 && i<eventNode.marketNodes[0].runners.length;i++) {
				data.addColumn('number', eventNode.marketNodes[0].runners[i].description.runnerName);
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
		var row = new Array();
		row.push(new Date());
		var marketNode = jsonData.eventTypes[0].eventNodes[0].marketNodes[0];
		for(i=0;i<20 && i<marketNode.runners.length;i++) {	
			if(marketNode.runners[i].exchange.availableToBack)
			row.push(1/marketNode.runners[i].exchange.availableToBack[0].price);
			else row.push(0);
		}
		
		data.insertRows(data.getNumberOfRows(),
				[row]);

		var lastTimeTo = data.getValue(data.getNumberOfRows()-1,0);
		var lastTimeToUTC = new Date(lastTimeTo.getTime()-(60000*(lastTimeTo.getTimezoneOffset())))
		var lastTimeFromUTC = new Date(lastTimeToUTC.getTime()-1000*60*10)
		annotatedtimeline.draw(data, {
			'dateFormat' : 'HH:mm:ss MMMM dd, yyyy',
			'displayZoomButtons' : false,
			'legendPosition': 'newRow',
			'displayRangeSelector' : false,
			'zoomStartTime': lastTimeFromUTC,
            'zoomEndTime': lastTimeToUTC, 
			'allowRedraw' : false
		});

		gadgets.window.adjustHeight()
	}
}
