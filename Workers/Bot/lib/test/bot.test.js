const Bot = require('../bot');


const Indicator = require('../../../MarketStream').Indicators.Indicator;
const TradingStrategy = require('../strategy');

class TestIndicator extends Indicator {
  constructor(attr, ...args) {
    super(...args);
    this.type = 'Test Indicator';
    this.updateType = 'price';
    this.specialAttribute = attr;
  }
}

var config = {
  defaults: {
    indicators: [
      new TestIndicator('Hello'),
      new TestIndicator('Goodbye')
    ],
  },
  handlers: {
    onWait: (data, response, onWait) => { },
    onWatch: (data, response, onWatch) => { },
    onLong: (data, response, onLong) => { },
    onShort: (data, response, onShort) => { }
  }
}

class MarketStream {
  constructor() {

  }
}

class tradeAccount {
  constructor() {

  }
}

strategy = new TradingStrategy(config);
marketStream = new MarketStream();
tradeAccount = new tradeAccount();

function reporter(transition, bot) {
  console.log(transition);
}

try {
  let bot = new Bot(1, marketStream, tradeAccount, strategy);
  bot.addReporter(reporter);

} catch(err) {
  console.error(err.message);
}
