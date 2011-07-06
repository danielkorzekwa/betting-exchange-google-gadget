function getMarketDetails(marketId,callback) {
	var params = {};
	params[gadgets.io.RequestParameters.CONTENT_TYPE] = gadgets.io.ContentType.JSON;
	var url = "http://betex.danmachine.com/getMarket?marketId=" + marketId
	makeCachedRequest(url, callback, params,0);
}

function getMarketProbability(marketId,callback,probType) {
	var params = {};
	params[gadgets.io.RequestParameters.CONTENT_TYPE] = gadgets.io.ContentType.JSON;
	var url = "http://betex.danmachine.com/getMarketProbability?marketId=" + marketId
	if(probType) url += "&probType=" + probType
	makeCachedRequest(url, callback, params, 0);
}

function makeCachedRequest(url, callback, params, refreshInterval) {
	var ts = new Date().getTime();
	var sep = "?";
	if (refreshInterval && refreshInterval > 0) {
		ts = Math.floor(ts / (refreshInterval * 1000));
	}
	if (url.indexOf("?") > -1) {
		sep = "&";
	}
	url = [ url, sep, "nocache=", ts ].join("");
	gadgets.io.makeRequest(url, callback, params);
}