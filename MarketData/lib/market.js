var Poloniex = require('../../Exchanges/poloniex');

class MarketHelper {
  constructor() {
    this.indicators = [];
    this.tickerData = [];
  }

  connect(exchange, pair) {
    this.exchange = new Poloniex(pair);
    this.exchange.onTick = this.onTickPrep;
    
    return this.exchange.open() 

      .catch((error) => {
        throw new Error('Unable to connect to exchange', error);
      });
  }

  on(timebase, callback) {

    if (timebase == '1M') {
      setInterval(callback, 60000);
    }
  }

  use(indicator) {
    this.indicators.push(indicator);
  }

  onTickPrep(data) {

    this.tickerData.push(data);

    updateIndicators('Price');
    data.indicators = this.indicators;

    this.onTick(data);
  }

  onTick() {
    //overridden by client
  }

  updateIndicators(type) {

    let indicators = _(indicators).filter(indicator => indicator.upateType === type);

    _(indicators).each(indicator => {
      indicator.update(tickerData[tickerData.length - 1].lastPrice)
    });
  }
}

module.exports = new MarketHelper();