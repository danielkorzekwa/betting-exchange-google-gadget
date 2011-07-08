var BetPlacerGadget = {

	init : function(form) {

		var marketId = form.marketIdInput.value
		getMarketDetails(marketId, marketDetailsCallBack)
		var marketJson
		function marketDetailsCallBack(obj) {
			marketDataJson = obj.data
			getMarketPrices(marketId, marketPricesCallBack)

		}
		function marketPricesCallBack(obj) {

			var marketPricesJson = obj.data

			if (marketDataJson.marketName) {

				/** Set market header. */
				var marketTime = new Date(marketDataJson.marketTime)
				var marketName = marketDataJson.eventName + " - " + pad(marketTime.getUTCHours(), 2) + ":"
						+ pad(marketTime.getUTCMinutes(), 2) + " " + marketDataJson.marketName
				document.getElementById('bet_placer_header_div').innerHTML = marketName

				/** Set market body. */
				createBetPlacerWidget(marketDataJson, marketPricesJson, '#bet_placer_widget_div')
			} else {
				document.getElementById('bet_placer_header_div').innerHTML = "Market not found."
				document.getElementById('bet_placer_widget_div').innerHTML = ""
			}

			gadgets.window.adjustHeight()
		}
	},

	test : function() {
		alert('Placing a bet is here...')
	}
}

function createBetPlacerWidget(marketDataJson, marketPricesJson, divElementId) {

	var runners = []
	for (i in marketDataJson.runners) {
		var runner = marketDataJson.runners[i]
		runners[i] = [ runner.runnerName, i ]
	}

	$(divElementId).html(
			'<table cellpadding="0" cellspacing="0" border="0" class="display" id="bet_placer_widget_table"></table>');
	$('#bet_placer_widget_table').dataTable(
			{
				"bPaginate" : false,
				"bFilter" : false,
				"bInfo" : false,
				"bSort" : false,
				"aaData" : runners,
				"aoColumns" : [
						{
							"sTitle" : "Runner"
						},
						{
							"sTitle" : "Best Prices",
							"fnRender" : function(obj) {
								var runnerIndex = obj.aData[obj.iDataColumn];

								var bestPrices = marketPricesJson.marketPrices[runnerIndex]
								var betButtons = '<input type="button" value="' + bestPrices.bestToBackPrice
										+ '" onClick="BetPlacerGadget.test()"/>' + '<input type="submit" value="'
										+ bestPrices.bestToLayPrice + '" onClick="BetPlacerGadget.test()"/>';

								return betButtons
							}
						} ]
			});
}

function pad(number, length) {

	var str = '' + number;
	while (str.length < length) {
		str = '0' + str;
	}
	return str;
}