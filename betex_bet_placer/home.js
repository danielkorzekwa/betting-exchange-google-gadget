var BetPlacerGadget = {

	betPlacerWidget : null,
	refreshBetPlacerTask : null,

	init : function(form) {

		this.betPlacerWidget = new BetPlacerWidget('#bet_placer_widget_div');
		this.marketId = form.marketIdInput.value
		clearInterval(this.refreshBetPlacerTask)

		this.refresh()
		this.refreshBetPlacerTask = setInterval("BetPlacerGadget.refresh()", 1000)
	},

	refresh : function() {
		getMarketDetails(BetPlacerGadget.marketId, marketDetailsCallBack)
		var marketJson
		function marketDetailsCallBack(obj) {
			marketDataJson = obj.data
			getMarketPrices(BetPlacerGadget.marketId, marketPricesCallBack)

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
				BetPlacerGadget.betPlacerWidget.refresh(marketDataJson, marketPricesJson)

			} else {
				document.getElementById('bet_placer_header_div').innerHTML = "Market not found."
				document.getElementById('bet_placer_widget_div').innerHTML = ""
			}

			gadgets.window.adjustHeight()
		}
	},

	placeBet : function(price,size,betType,runnerId) {
		alert('price=' + price + ',size=' + size + ',betType=' + betType + ',runnerId=' + runnerId)
	}
}

function pad(number, length) {

	var str = '' + number;
	while (str.length < length) {
		str = '0' + str;
	}
	return str;
}