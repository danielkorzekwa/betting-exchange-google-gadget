var BetPlacerGadget = {

	userId : Math.floor(Math.random() * (Math.pow(2, 31) - 1)),
	betPlacerWidget : null,
	refreshBetPlacerTask : null,
	marketId : null,

	init : function(form) {
		this.betPlacerWidget = new BetPlacerWidget('#bet_placer_widget_div');
		this.marketId = form.marketIdInput.value
		clearInterval(this.refreshBetPlacerTask)

		this.refresh()
		this.refreshBetPlacerTask = setInterval("BetPlacerGadget.refresh()", 1000)
	},

	refresh : function() {
		getMarketDetails(BetPlacerGadget.marketId, marketDetailsCallback)
		var marketJson
		var marketPricesJson
		var riskJson
		function marketDetailsCallback(obj) {
			marketDataJson = obj.data
			getMarketPrices(BetPlacerGadget.marketId, marketPricesCallback)

		}
		function marketPricesCallback(obj) {

			marketPricesJson = obj.data
			getRisk(BetPlacerGadget.userId, BetPlacerGadget.marketId, riskCallback)

		}

		function riskCallback(obj) {
			riskJson = obj.data
			refreshBetPlacerWidget()
		}

		function refreshBetPlacerWidget() {
			if (marketDataJson.marketName) {

				/** Set market header. */
				var marketTime = new Date(marketDataJson.marketTime)
				var marketName = marketDataJson.eventName + " - " + pad(marketTime.getUTCHours(), 2) + ":"
						+ pad(marketTime.getUTCMinutes(), 2) + " " + marketDataJson.marketName
				document.getElementById('bet_placer_header_div').innerHTML = marketName

				/** Set market body. */
				BetPlacerGadget.betPlacerWidget.refresh(marketDataJson, marketPricesJson, riskJson)

			} else {
				document.getElementById('bet_placer_header_div').innerHTML = "Market not found."
				document.getElementById('bet_placer_widget_div').innerHTML = ""
			}

			gadgets.window.adjustHeight()
		}
	},

	placeBet : function(betSize, betPrice, betType, marketId, runnerId) {

		function betCallback(obj) {
			var betStatusJson = obj.data
			if (!betStatusJson || betStatusJson.status != "OK")
				alert("Bet placement error: " + JSON.stringify(betStatusJson))
		}
		placeBet(this.userId, betSize, betPrice, betType, marketId, runnerId, betCallback)
		this.refresh()
	},

	hedge : function(marketId, runnerId) {
		hedge(this.userId, marketId, runnerId)
	}
}

function pad(number, length) {

	var str = '' + number;
	while (str.length < length) {
		str = '0' + str;
	}
	return str;
}