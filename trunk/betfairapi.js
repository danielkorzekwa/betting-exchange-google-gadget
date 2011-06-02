function getMarketPrices(marketId,callback) {
	var params = {};
	params[gadgets.io.RequestParameters.CONTENT_TYPE] = gadgets.io.ContentType.JSON;
	var url = "http://uk-api.betfair.com/www/sports/exchange/readonly/v1.0/bymarket?marketIds=1."
			+ marketId
			+ "&types=RUNNER_EXCHANGE_PRICES_BEST&alt=json";
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