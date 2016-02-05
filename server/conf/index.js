'use strict';

module.exports = (store) => {
  return new NenyaConfigurator(store);
}



let nFlux   = require('nenya-flux')();
let bole    = require('bole');
let log     = bole('#CONF');

const ACTIONS = require('../stores/app.actions');

const DEFAULTS_PATH = './defaults.conf';

const ENV = {
  DEV : 'development',
  EVAL: 'staging',
  PROD: 'production'
};

const ENV_LOGLEVEL = {
  DEV:  'debug',
  EVAL: 'info',
  PROD: 'error'
};


class NenyaConfigurator {

  constructor (appStoreSubscription) {
    this._subscribeToAppStore = appStoreSubscription;
    this.makeActions();
    this.bindSubscriptions();
  }

  makeActions () {
    this._setAppEnv = nFlux.createAction(ACTIONS.SET_ENVIRONMENT);
  }

  bindSubscriptions () {
    this._subscribeToAppStore(_configureLogger, ACTIONS.SET_ENVIRONMENT); 
  }

  configure () {
    let defaults = require(DEFAULTS_PATH);
    if (defaults.env.type) this._setAppEnv(defaults.env.type);

    log.debug(defaults);
  }

}



function _configureLogger (store, data) {
  let state = store.getState();
  let logOutput = {
    level: ENV_LOGLEVEL[state.env],
    stream: process.stdout
  };
  bole.output(logOutput);

  log.info('Log is Ready');
}

