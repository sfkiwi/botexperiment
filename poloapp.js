var autobahn = require('autobahn');
var _ = require('underscore');
var SMA = require('./Indicators/ema');
var EMA = require('./Indicators/sma');
var PSAR = require('./Indicators/psar');

var wsuri = "wss://api.poloniex.com";
var connection = new autobahn.Connection({
  url: wsuri,
  realm: "realm1"
});

var subs = [];
var tickerData = [];
var indicators = [];
var currentTicker = 'BTC_ETH'



var updateIndicators = function() {

    _.each(_.filter(indicators, function(indicator) {
        return (indicator.upateType === 'Price');
      }), function(indicator) {
            indicator.update(tickerData[tickerData.length-1].lastPrice);
    });
}

var session_1M = function() {

  setTimeout(session_1M, 60000);

  var currentTime = Date.now();
  var session = _.filter(tickerData, function(ticker) {
    return ((ticker.time < currentTime) && (ticker.time > (currentTime - 60000)));
  });

  var candelstick = {
    open: session[0].lastPrice,

    high:_.reduce(session,function(memo, object) {
                      return Math.max(memo, object.lastPrice);
                    },session[0].lastPrice),

    low:_.reduce(session,function(memo, object) {
                      return Math.min(memo, object.lastPrice);
                    },session[0].lastPrice),

    close: session[session.length-1].lastPrice
  };

  _.each(_.filter(indicators, function(indicator) {
      return (indicator.upateType === 'Candelstick');
    }), function(indicator) {
          indicator.update(candelstick);
          process.stdout.write(`${indicator.type}: ${indicator.last}\n\n`);
  });
  process.stdout.write(`###############################\n`);
  process.stdout.write(`##### Time: ${new Date(currentTime).toString()}\n`);
  process.stdout.write(`##### Open: ${candelstick.open}\n`);
  process.stdout.write(`##### High: ${candelstick.high}\n`);
  process.stdout.write(`##### Low: ${candelstick.low}\n`);
  process.stdout.write(`##### Close: ${candelstick.close}\n`);
  process.stdout.write(`###############################\n\n`);

}

connection.onopen = function (session, details) {


  function marketEvent (args,kwargs, details) {
		console.log(args);
	}
	function tickerEvent (args,kwargs, details) {

    //console.log(`Args: ${args}`);
    if (args) {
      if (args[0] === currentTicker) {
        tickerData.push(
          {
            time: Date.now(),
            ticker: args[0],
            lastPrice: parseFloat(args[1]),
            lowestAsk: parseFloat(args[2]),
            highestBid: parseFloat(args[3]),
            change: parseFloat(args[4]),
            baseVolume: parseFloat(args[5]),
            quoteVol: parseFloat(args[6]),
            isFrozen: args[7],
            high24hr: parseFloat(args[8]),
            low24hr: parseFloat(args[9])
          });

        updateIndicators();
        console.log(`[${tickerData.length}] ${args[0]}: ${args[1]}`);

        process.stdout.write("SMA:");
        _.each(_.filter(indicators, function (indicator) {
          return indicator.type === 'SMA';
        }), function( indicator ) {
          process.stdout.write( ` | (${indicator.period}):${indicator.last}` );
        });
        process.stdout.write("\n");

        process.stdout.write("EMA:");
        _.each(_.filter(indicators, function (indicator) {
          return indicator.type === 'EMA';
        }), function( indicator ) {
          process.stdout.write( ` | (${indicator.period}):${indicator.last}` );
        });
        process.stdout.write("\n\n");
      }
    }
  }

	function trollboxEvent (args,kwargs, details) {
		console.log(args);
	}


  //session.subscribe('BTC_XMR', marketEvent);

	session.subscribe('ticker', tickerEvent).then(
    function (subscription) {
      console.log(`Successfully Subscribed to: ${subscription.topic} id:${subscription.id}`);
      subs.push({name:'ticker', sub: subscription});
    },
    function (error) {
      console.log("Unable to subscribe");
      console.error(error);
    }
  );
	//session.subscribe('trollbox', trollboxEvent);
}

connection.onclose = function (reason, details) {
  if (reason === "unreachable") {
    console.log(`Unable to establish connection (retry no: ${details.retry_count})`);
  } else if (reason === "lost") {
    console.log("Connection Lost");
  } else if (reason === "closed") {
    console.log("Websocket connection closed");
    if (details.message) {
      console.log(`Message: ${details.message}`);
    }
  } else if (reason === "unsupported") {
    console.log("Websocket connection not supported");
  } else {
    console.log("Connection Closed: Unknown Reason");
  }
}

if (process.argv.length > 2) {
  currentTicker = process.argv[2];
  console.log("Ticker Symbol " + currentTicker );
}

connection.open();

indicators.push(new SMA(5));
indicators.push(new SMA(15));
indicators.push(new SMA(60));
indicators.push(new EMA(10));
indicators.push(new EMA(50));
indicators.push(new EMA(100));

indicators.push(new PSAR(0.02,0.2));
setTimeout(session_1M, 60000);
