'use strict';

let expect = require('expect');
let nenyaFlux = require('nenya-flux')();
let AppStore = require('../server/stores/app.store');



const ACTIONS       = require('../server/stores/app.actions');



describe ('With AppStore', () => {

  describe ('When required', () => {  
    it('Should be a function', function () {
      expect(typeof AppStore).toBe('function');
    });
  });

  describe ('When initialized', () => {  
    let domainStore = AppStore();

    it('Should return an object', function () {
      expect(typeof domainStore).toBe('object');
    });

    it('Object should expose getState function', function () {
      expect(typeof domainStore.getState).toBe('function');
    });

    // it('Object should expose used actions', function () {
      // expect(typeof domainStore.actions).toBe('object');
      // let availableActions = domainStore.actions;
      // expect(Object.keys(availableActions).length).toBe(1);
// 
    // });
  });
 

  describe ('When used with NenyaFlux', () => {  
    let appStore = AppStore();
    let subscribeToAppStore = nenyaFlux.createSubscription(appStore);

    it('avoids unknown actions', (done) => {
			
      let fnAction = nenyaFlux.createAction(ACTIONS.GET_DOMAIN_CONFIG);
      subscribeToAppStore(unreachable, ACTIONS.GET_DOMAIN_CONFIG);

      fnAction(5);
      
      done();

    });

    it('reach known actions', (done) => {
      
      let fnAction = nenyaFlux.createAction(ACTIONS.SET_ENVIRONMENT);
      subscribeToAppStore(testSubscriber, ACTIONS.SET_ENVIRONMENT);

      fnAction(done);
      
    });

  });

});

function unreachable () {
  throw new Error("Reached unreachable method");
}

function testSubscriber (store) {
  let s = store.getState();
 
  s.env();
}

