function BetPlacerWidget(widgetDivId) {
	this.widgetDivId = widgetDivId
}

BetPlacerWidget.prototype.refresh = function(marketDataJson, marketPricesJson) {
	var runners = []
	for (i in marketDataJson.runners) {
		var runner = marketDataJson.runners[i]
		runners[i] = [ runner.runnerName, i ]
	}
		
	$(this.widgetDivId).html(
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
								 
								function createBetPlacement(price,betType,runnerId) {
									var size = 2
									return 'BetPlacerGadget.placeBet(' + price + ',' + size + ',\'' + betType + '\'' + ',' + bestPrices.runnerId + ')'
								}
								var betButtons = '<input type="button" value="' + bestPrices.bestToBackPrice
										+ '" onClick="' + createBetPlacement(bestPrices.bestToBackPrice,"BACK") + '"/>' + '<input type="submit" value="'
										+ bestPrices.bestToLayPrice + '" onClick="' + createBetPlacement(bestPrices.bestToLayPrice,"LAY") + '"/>';

								return betButtons
							}
						} ]
			});
}
