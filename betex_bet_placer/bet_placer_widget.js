function BetPlacerWidget(widgetDivId) {
	this.widgetDivId = widgetDivId
}

BetPlacerWidget.prototype.refresh = function(marketDataJson, marketPricesJson, riskJson) {
	var runnersData = []
	for (i in marketDataJson.runners) {
		var runner = marketDataJson.runners[i]
		runnersData[i] = [ runner.runnerName + ': ' + riskJson.runnerIfwins[i].ifWin, i, i ]
	}

	$(this.widgetDivId)
			.html(
					'</br>MarketExpectedProfit: '
							+ riskJson.marketExpectedProfit
							+ '</br>'
							+ '<table cellpadding="0" cellspacing="0" border="0" class="display" id="bet_placer_widget_table"></table>');
	$('#bet_placer_widget_table').dataTable(
			{
				"bPaginate" : false,
				"bFilter" : false,
				"bInfo" : false,
				"bSort" : false,
				"aaData" : runnersData,
				"aoColumns" : [
						{
							"sTitle" : "Runner"
						},
						{
							"sTitle" : "Best Prices",
							"fnRender" : function(obj) {

								var runnerIndex = obj.aData[obj.iDataColumn];

								var bestPrices = marketPricesJson.marketPrices[runnerIndex]

								function createBetPlacement(betPrice, betType, runnerId) {
									var betSize = 2
									return 'BetPlacerGadget.placeBet(' + betSize + ',' + betPrice + ',\'' + betType
											+ '\'' + ',' + marketDataJson.marketId + ',' + bestPrices.runnerId + ')'
								}
								var betButtons = '<input type="button" value="' + bestPrices.bestToBackPrice
										+ '" onClick="' + createBetPlacement(bestPrices.bestToBackPrice, "BACK")
										+ '"/>' + '<input type="submit" value="' + bestPrices.bestToLayPrice
										+ '" onClick="' + createBetPlacement(bestPrices.bestToLayPrice, "LAY") + '"/>';

								return betButtons
							}
						},
						{
							"sTitle" : "Hedge",
							"fnRender" : function(obj) {

								var runnerIndex = obj.aData[obj.iDataColumn];
								var runnerId = marketDataJson.runners[runnerIndex].runnerId

								function createHedgeAction() {
									return 'BetPlacerGadget.hedge(' + marketDataJson.marketId + ',' + runnerId + ')'
								}

								var hedgeButton = '<input type="button" value="hedge" onClick="' + createHedgeAction()
										+ '"/>'
								return hedgeButton
							}
						} ]
			});
}
