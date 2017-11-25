var Indicator = require('./indicators');

//Parabolic SAR Object Prototype
class ParabolicSAR extends Indicator {
  constructor (start, increment, max) {
    super();
    this.type = 'Parabolic SAR';
    this.start = start || 0.02;
    this.increment = increment || 0.02;
    this.max = max || 0.20;
  }

  update (price) {
    //Previous SAR = The SAR value for the previous period.
    //add latest price to local price history
    this.data.push(price);
//Extreme Point (EP) = The highest high of the current uptrend or the lowest low of the current downtrend.
//Acceleration Factor (AF) = Determines the sensitivity of the SAR.
//AF starts at .02 and increases by .02 every time the EP rises in a Rising SAR or EP falls in a Falling SAR.

//The calculations for Rising Parabolic SAR and Falling Parabolic SAR are different so they will be separated.

//Rising Parabolic SAR
//Previous SAR + Previous AF(Previous EP + Previous SAR) = Current SAR

//Falling Parabolic SAR
//Previous SAR - Previous AF(Previous SAR - Previous EP) = Current SAR*/
  }
}

module.exports = ParabolicSAR;
