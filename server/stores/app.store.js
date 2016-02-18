'use strict';

const STATUS_CODES  = require('../conf/status-codes.conf');
const ACTIONS       = require('./app.actions');



let NenyaFlux = require('nenya-flux')();
let m         = require('mithril');
let log       = require('bole')('#APP_STORE');

let emptyState = {
  //
  // site meta
  //  
  meta:   {},
  
  //
  // page meta with default output to html5
  //  
  page:   { 
    docType: "html5" 
  },
     
  //
  // environment
  //
  env:    {},
  
  //
  // theme handler
  //
  theme:  null,
  
  //
  // database properties with an empty connection
  //
  db:     {
    conn: null
  }, 
};



module.exports = (initialState) => {
  return new AppStore(initialState);
}



class AppStore extends NenyaFlux.NenyaStore {
  constructor (initialState) {
    
    initialState = Object.assign({}, emptyState, initialState);
    
    super(initialState);
    
    this.addAction(ACTIONS.SET_ENVIRONMENT, setEnvironment);
    this.addAction(ACTIONS.SET_SITE_META,   setSiteMeta);
    this.addAction(ACTIONS.ADD_PAGE_META,   addPageMeta);
    this.addAction(ACTIONS.SET_DATABASE,    setDatabase);
    this.addAction(ACTIONS.SET_THEME,       setTheme);
    this.addAction(ACTIONS.APP_READY,       appReady);
  }
   
  get statusCode () {
    return STATUS_CODES.SUCCESS;
  }
   
  get doctypeHeader () {
    let header = '';
    
    if (this._state.page.docType === 'html5') {
      header = '<!doctype html>';
    }
    
    return header;
  }
  
  getPageTitle () {
    return this._state.meta.siteTitle;
  }
   
}


function setEnvironment (state, env) {
  state.env = env;
}

function setSiteMeta (state, meta) {
  state.meta = meta;  
}

function addPageMeta (state, meta) {
  state.page = Object.assign({}, state.page, meta);
}

function setDatabase (state, db) {
  state.db = db;
}

function setTheme (state, ThemeHandler) {
  state.theme = ThemeHandler();
}

function appReady (state, conn) {
  state.connection = conn;
  log.info('App is Ready');
}

