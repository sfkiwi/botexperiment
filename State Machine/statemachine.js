var StateMachine = require('javascript-state-machine');
var visualize = require('javascript-state-machine/lib/visualize');

var fsm = new StateMachine({
    init: 'waiting',
    transitions: [
      { name: 'engage',    from: 'waiting',    to: 'watching'   },
      { name: 'buy',       from: 'watching',   to: 'trading'    },
      { name: 'disengage', from: 'watching',   to: 'waiting'    },
      { name: 'exit',      from: 'trading',    to: 'completing' },
      { name: 'ready',     from: 'completing', to: 'watching'   }     
    ],
    methods: {
      onEngage:    function() { console.log('I melted')    },
      onBuy:       function() { console.log('I froze')     },
      onDisengage: function() { console.log('I vaporized') },
      onExit:      function() { console.log('I condensed') },
      onReady:     function() { console.log('I condensed') }      
    }
  });

  console.log(visualize(fsm));



  //fsm.is(s) - return true if state s is the current state
  //fsm.can(t) - return true if transition t can occur from the current state
  //fsm.cannot(t) - return true if transition t cannot occur from the current state
  //fsm.transitions() - return list of transitions that are allowed from the current state
  //fsm.allTransitions() - return list of all possible transitions
  //fsm.allStates() - return list of all possible states



//Start in waiting

//In Waiting State:
// if stock is in Play 
    //transition to watching
