'use strict';

class AbstractFlux {

  constructor (appStoreSubscription) {
    this.subscribeToAppStore = appStoreSubscription;
    this.makeActions();
    this.bindSubscriptions();
  }

  makeActions () {
  }

  bindSubscriptions () {
  }

}

module.exports = AbstractFlux;
