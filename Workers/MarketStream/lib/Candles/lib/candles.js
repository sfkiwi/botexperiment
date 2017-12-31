class Candle {
  constructor() {
    this.type = 'none'; // 'EMA', 'SMA', 'ParabolicSAR'
    this.updateType = 'undefined'; // 'Price', 'Candelstick'
    this.isValid = false;
    this.data = []; //store past [period] no of prices
    this.history = []; //store past MA values
    this.last = 0; //store last calculated MA
  }

  update() { return };
  oninit() { return };
  reset() { return };
}

module.exports = Candle;