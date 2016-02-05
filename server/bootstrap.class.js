'use strict';

const STATUS_CODES  = require('./conf/status-codes.conf');
const ACTIONS       = require('./stores/app.actions');
const CONF_PATH     = './conf';



// let domainStore = {};// require('./stores/domain.store')();
let nFlux           = require('nenya-flux')();
let mRender         = require('mithril-node-render');
let m               = require('mithril');
let log             = require('bole')('#BOOT');
let AppStore        = require('./stores/app.store');
let NenyaRenderer   = require('./renderer.class');
let configurator    = require(CONF_PATH);
// let nDomains = require('nenya-domains')(__dirname + '/');



class NenyaBootstrap {
    
  constructor () {
    this._appStore = AppStore(_initialState());
    this._appStoreSub = nFlux.createSubscription(this._appStore);
    this._actions = _makeActions();
    
    _bindSubscribers(this._appStoreSub);
  }
    
  boot (conn) {
    console.log('Run');
    
    configurator(this._appStoreSub).configure();

    // this.render();
    this._actions.appReady(conn);
  }
    
}



module.exports = NenyaBootstrap;



function _makeActions () {
  return {
    appReady: nFlux.createAction(ACTIONS.APP_READY)
  }
}

function _bindSubscribers (subscription) {
  subscription(_render, ACTIONS.APP_READY); 
}  

function _initialState () {
  return require(CONF_PATH + '/app.conf');
} 

function _render (store) {
  let nRenderer = new NenyaRenderer(store);
  nRenderer.render();  
}

