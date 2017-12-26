var market = require('./MarketData');

var SMA = require('./Indicators/ema');
var EMA = require('./Indicators/sma');
var PSAR = require('./Indicators/psar');

var session_1M = function(data) {
  console.log('1M Tick', data);
}

var onTick = function(data) {
  console.log('Price Tick', data);
};

market.onTick = onTick;
market.connect('Poloniex', 'BTC_ETH');

market.use(new SMA(5));
market.use(new SMA(15));
market.use(new SMA(60));
market.use(new EMA(10));
market.use(new EMA(50));
market.use(new EMA(100));
market.use(new PSAR(0.02,0.2));

market.on('1M', session_1M);
