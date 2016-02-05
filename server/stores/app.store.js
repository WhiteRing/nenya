'use strict';

const STATUS_CODES  = require('../conf/status-codes.conf');
const ACTIONS       = require('./app.actions');



let NenyaFlux = require('nenya-flux')();
let m         = require('mithril');
let log       = require('bole')('#APP_STORE');



module.exports = (initialState) => {
  return new AppStore(initialState);
}



class AppStore extends NenyaFlux.NenyaStore {
  constructor (initialState) {
    super(initialState);
  
    this.addAction(ACTIONS.SET_ENVIRONMENT, setEnvironment);
    this.addAction(ACTIONS.APP_READY, appReady);
  }
   
  get statusCode () {
    return STATUS_CODES.SUCCESS;
  }
   
  get doctypeHeader () {
    let header = '';
    
    if (this._state.docType === 'html5') {
      header = '<!doctype html>';
    }
    
    return header;
  }
   
}


function setEnvironment (state, env) {
  state.env = env;
}

function appReady (state, conn) {
  state.connection = conn;
  log.info('App is Ready');
}

