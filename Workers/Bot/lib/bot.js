const StateMachine = require('javascript-state-machine');
const FilteredStream = require('../../MarketStream').FilteredStream;
const Order = require('./order.js');
const Response = require('./response.js');
const TradingStrategy = require('./strategy');


var http = require('axios');
const port = process.env.PORT || 3000;
const baseURL = process.env.BASEURL || 'http://localhost';
http.defaults.baseURL = `${baseURL}:${port}`;
http.defaults.headers.post['Content-Type'] = 'application/json;charset=utf-8';

class Bot {
  constructor (id, asset, marketStream, tradeAccount, strategy = new TradingStrategy()) {

    this.id = id;
    this.marketStream = marketStream;
    this.tradeAccount = tradeAccount;

    this.sm = new StateMachine({
      init: 'init',
      transitions: [
        { name: 'start', from: 'init', to: 'waiting' },              
        { name: 'engage', from: 'waiting', to: 'watching' },
        { name: 'disengage', from: 'watching', to: 'waiting' },
        { name: 'buy', from: 'watching', to: 'trading' }, 
        { name: 'sell', from: 'watching', to: 'trading' },             
        { name: 'exit', from: 'trading', to: 'housekeeping' },
        { name: 'ready', from: 'housekeeping', to: 'watching' },
        { name: 'bigredbutton', from: '*', to: 'shutdown' },
        { name: 'reset', from: 'shutdown', to: 'init' }
      ],
      methods: {
        onBeforeBuy: this.prepareBuyOrder,
        onBeforeSell: this.prepareSellOrder,
      }
    });

    this.handlers = {
      'init' : this.init.bind(this),
      'waiting' : this.waiting.bind(this),
      'watching' : this.watching.bind(this),
      'trading' : this.trading.bind(this),
      'housekeeping' : this.housekeeping.bind(this),
      'shutdown' : this.shutdown.bind(this)
    };

    if (strategy instanceof TradingStrategy) {
      this.strategy = strategy;
    } else {
      throw new TypeError('Strategy must be an instance of TradingStrategy');
      this.sm.bigRedButton();
    }

    if (!this.marketStream) {
      throw new TypeError('No MarketStream provided');
      this.sm.bigRedButton();
    }

    if (!this.tradeAccount) {
      throw new TypeError('No TradeAccount provided');
      this.sm.bigRedButton();
    }
  }

  // State Handlers

  init(stream) {

    this.filteredStream = new FilteredStream();
    this.filteredStream.use(this.strategy.indicators);
    this.filteredStream.use(this);

    marketStream.open(this.filteredStream.streamHandler)

      .then(() => {
        this.sm.start();
      })

      .catch(err => {
        this.sm.bigRedButton(err);
      });
  }

  waiting(stream) {

    let response = new Response();
    this.strategy.handlers.onWait({stream: stream}, response);

    if (response.active) {
      this.sm.engage();
      return;
    }
  }

  watching(stream) {
    // no market activity

    let response = new Response();
    this.strategy.handlers.onWatch({stream: stream}, response);
    
    if (response.idle) {
      this.sm.disengage();
      return;
    }

    if (response.order) {
      this.position = response.order;
      
      this.tradeAccount.details()

        .then((details) => {
          order.accountSize = details.size;
          order.risk = 0.02;

          if (order.quantity > details.minOuantity) {
            return this.tradeAccount.requestOrder(order);
          }

          return false;
        })

        .then((success) => {
          if (success) {
            if (order.isBuyOrder) {
              this.sm.buy();
            } else if (order.isSellOrder) {
              this.sm.sell();
            }
          }
        })

        .catch((err) => {
          this.sm.bigRedButton(err);
        });        
    }

    if (response.stop) {
      this.sm.bigRedButton();
      return;
    }
  }

  trading(stream) {

    let response = new Response();
    
    let data = {
      stream: stream,
      order: this.position
    }

    this.strategy.handlers.onTrade(data, response);

    if (response.exit) {

      this.tradeAccount.exitPosition()
          
        .then((success) => {
          if (success) {
            this.sm.exit();
          } 
        })

        .catch((err) => {
          this.sm.bigRedButton(err);
        });
    }

    if (response.stop) {
      this.sm.bigRedButton();
      return;
    }
  }

  housekeeping(stream) {
    //when ready
    this.sm.ready();
  }

  shutdown(stream) {
    this.sm.reset();
  }

  // Marketstream Handler

  update(data) {
    this.handlers[this.sm.state](data);
  }

  prepareBuyOrder(lifecycle, ...args) {
    console.log(`Preparing to make Buy Order`);
  }

  prepareSellOrder(lifecycle, ...args) {
    console.log(`Preparing to make Sell Order`);
  }

  addReporter(callback) {
    this.sm.observe('onTrasition', (lifecycle, ...args) => {
      callback(lifecycle.transition, this);
    });
  }
}

module.exports = Bot;