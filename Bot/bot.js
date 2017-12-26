var StateMachine = require('javascript-state-machine');

class Bot {
    constructor (ticker, xc) {
        
        this.ticker = ticker;
        this.xc = xc;

        this.sm = new StateMachine({
            init: 'waiting',
            transitions: [
                { name: 'engage', from: 'waiting', to: 'watching' },
                { name: 'buy', from: 'watching', to: 'trading' },
                { name: 'disengage', from: 'watching', to: 'waiting' },
                { name: 'exit', from: 'trading', to: 'completing' },
                { name: 'ready', from: 'completing', to: 'watching' }
            ],
            methods: {
                onEngage: function () { console.log('I melted') },
                onBuy: function () { console.log('I froze') },
                onDisengage: function () { console.log('I vaporized') },
                onExit: function () { console.log('I condensed') },
                onReady: function () { console.log('I condensed') }
            }
        });


    }
    get ticker() {
        return this.ticker;
    }

    get exchange() {
        return this.xc;
    }

    set strategy() {

    }

    hasStrategy() {

    }

    getStats() {
        
    }
}