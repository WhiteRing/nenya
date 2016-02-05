'use strict';

let nenyaFlux = require('nenya-flux')();
let NStore = nenyaFlux.store;
let log = require('bole')('domain.store');

let initialState = {
  domain: {
    theme: 'default'
  }
};

let actions = {
  ADD_DOMAIN_CONFIG: '@ADD_DOMAIN_CONFIGURATION@'
};

module.exports = () => {
  let nStore = {};

  nStore.__proto__ = NStore (initialState);

  nStore.addAction(actions.ADD_DOMAIN_CONFIG, addDomainConfig);

  nStore.actions = actions;

  nStore.getTheme = () => {
    let state = nStore.getState();
    return state.domain.theme;
  };

  nStore.getPalette = () => {
    let state = nStore.getState();
    return state.domain.palette;
  };

  return nStore;
}

function addDomainConfig (state, payload) {
  state = Object.assign({}, state, payload);

  return state;
}

