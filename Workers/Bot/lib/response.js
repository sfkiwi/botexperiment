class Response {
  constructor() {

  }
  placeOrder(o) {
    if (o instanceof BuyOrder || o instanceof SellOrder) {
      this.order = o;
    } else {
      throw new TypeError('order should be instance of Order');
    }
  }

  active() { this._active = true; }  
  idle() { this._idle = true; }
  stop() { this._idle = true; }
  
  get stop() { return this._idle; }
  get idle() { return this._idle; }
  get active() { return this._active; }
  get order() { return this.order; }
}

module.exports = Response;