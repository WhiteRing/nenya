'use strict';

let expect = require('expect');
let nenyaFlux = require('nenya-flux')();
let DomainStore = require('../stores/domain.store');

describe ('With DomainStore', () => {

  describe ('When required', () => {  
    it('Should be a function', function () {
      expect(typeof DomainStore).toBe('function');
    });
  });

  describe ('When initialized', () => {  
    let domainStore = DomainStore();

    it('Should return an object', function () {
      expect(typeof domainStore).toBe('object');
    });

    it('Object should expose getState function', function () {
      expect(typeof domainStore.getState).toBe('function');
    });

    it('Object should expose used actions', function () {
      expect(typeof domainStore.actions).toBe('object');
      let availableActions = domainStore.actions;
      expect(Object.keys(availableActions).length).toBe(1);

    });
  });
 

  describe ('When used inside NenyaFlux', () => {  
    let domainStore = DomainStore();
    let actionType = domainStore.actions.ADD_DOMAIN_CONFIG;
    let fnAction = nenyaFlux.createAction(actionType);

    let subscription = nenyaFlux.createSubscription(domainStore);

    it('call subscriber', (done) => {
      function testSubscriber (store) {
        console.log('Test subscriber');
        let s = store.getState();
        console.log(store);
        console.log(s);
     
        done();
      }
				
      subscription(testSubscriber, true);

      fnAction(5);

    });

  });

});

