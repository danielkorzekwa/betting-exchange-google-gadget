function start(msg) {
	document.getElementById('content_div').innerHTML = "Under construction....";
	msg.createDismissibleMessage("start");
	getHtml();
}
function getHtml() {
	var params = {};
	params[gadgets.io.RequestParameters.CONTENT_TYPE] = gadgets.io.ContentType.TEXT;
	var url = "http://uk-api.betfair.com/www/sports/exchange/readonly/v1.0/allmarkets?alt=json&currencyCode=GBP&locale=en_GB&types=EVENT,MARKET_DESCRIPTION,MARKET_STATE&marketBettingTypes=ODDS&maxResults=5";
	gadgets.io.makeRequest(url, response, params);
};
function response(obj) {
	// obj.text contains the text of the page that was requested
	var str = obj.text;
	var html = str
	document.getElementById('content_div').innerHTML = str;
};
