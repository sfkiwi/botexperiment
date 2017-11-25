//Top Level Indicator Object Prototype
class Indicator {
  constructor() {
    this.type = 'none';
    this.isValid = false;
    this.data = []; //store past [period] no of prices
    this.history = []; //store past MA values
    this.last = 0; //store last calculated MA
  }

  update() { return };
  oninit() { return };
  reset() { return };
}

module.exports = Indicator;
