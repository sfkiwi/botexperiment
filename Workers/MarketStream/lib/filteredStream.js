const { Indicator } = require('./Indicators');
const { Candle } = require('./Candles');

class FilteredStream {
  constructor() {
    this.candles = [];
    this.indicators = [];
    this.handlers = [];
  }  

  streamHandler(args) {
    let [data] = args;

    data = this.candles.reduce((data, candle) => candle(data), data);
    data = this.indicators.reduce((data, indicator) => indicator(data), data);
    data = this.handlers.reduce((data, handler) => handler(data), data);
  }

  use(handlers) {

    if (!Array.isArray(handlers)) {
      handlers = [handlers];
    }

    handlers.forEach((handler) => {
      if (handler instanceof Candle) {
        this.candles.push(handler.update.bind(handler));
      } else if (handler instanceof Indicator) {
        this.indicators.push(handler.update.bind(handler));
      } else {
        this.handlers.push(handler.update.bind(handler));
      }
    })
  }
}

module.exports = FilteredStream;