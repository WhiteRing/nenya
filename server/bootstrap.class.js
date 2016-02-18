'use strict';

const STATUS_CODES  = require('./conf/status-codes.conf');
const ACTIONS       = require('./stores/app.actions');
const CONF_PATH     = './conf';



let nFlux           = require('nenya-flux')();
let mRender         = require('mithril-node-render');
let m               = require('mithril');
let log             = require('winston');
let AppStore        = require('./stores/app.store');
let NenyaRenderer   = require('./renderer.class');
let Configurator    = require(CONF_PATH);



class NenyaBootstrap {
    
  constructor () {
    this._appStore      = AppStore(_initialState());
    this._appStoreSub   = nFlux.createSubscription(this._appStore);
    this._actions       = _makeActions();
    this._configurator  = Configurator(this._appStoreSub);
        
    _bindSubscribers(this._appStoreSub);
  }
    
  boot (conn) {
    log.info('// >>>>>>>>>>>>>>>');
        
    this._appStore.resetState();
    
    this._configurator.configure(conn.hostname);

    log.info('// <<<<<<<<<<<<<<<');
    
    this._actions.appReady(conn);

    log.info('.');
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
  return {};
} 

function _render (store) {
  let nRenderer = new NenyaRenderer(store);
  nRenderer.render();  
}

