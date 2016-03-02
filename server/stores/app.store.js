'use strict';

const STATUS_CODES  = require('../conf/status-codes.conf');
const ACTIONS       = require('./app.actions');



let NenyaFlux = require('nenya-flux')();
let m         = require('mithril');
let log       = require('bole')('#APP_STORE');
let dbClient  = require('mongodb').MongoClient;
let assert    = require('assert');
let Q         = require('q');

var mongoose  = require('mongoose');



//
// Default application state
//
let emptyState = {
  //
  // site meta
  //  
  meta:   {},
  
  //
  // page meta with default output to html5
  //  
  page:   {
    statusCode: STATUS_CODES.SUCCESS,
    docType:    "html5" 
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
  
  //
  // Request data
  //
  request: {
    path: '',
    conn: null,
    route: null
  } 
};

//
// Actions dispatched from this store
//
let _appActions = {};



module.exports = (initialState) => {
  return new AppStore(initialState);
}


//
// Application's main store 
//
class AppStore extends NenyaFlux.NenyaStore {
  constructor (initialState) {
    
    initialState = Object.assign({}, emptyState, initialState);
    
    super(initialState);
    
    this.defineActions();
    
    _appActions.dbConnected = NenyaFlux.createAction(ACTIONS.DB_CONNECTED);
  }
  
  defineActions () {
    this.addAction(ACTIONS.SET_ENVIRONMENT,   setEnvironment);
    this.addAction(ACTIONS.SET_SITE_META,     setSiteMeta);
    this.addAction(ACTIONS.ADD_PAGE_META,     addPageMeta);
    this.addAction(ACTIONS.SET_DATABASE,      setDatabase);
    this.addAction(ACTIONS.DB_CONNECTED,      dbConnected);
    this.addAction(ACTIONS.SET_REQUEST,       setRequest);
    this.addAction(ACTIONS.SET_THEME_NAME,    setThemeName);
    this.addAction(ACTIONS.SET_THEME_HANDLER, setThemeHandler);
    this.addAction(ACTIONS.PERFORM_ROUTING,   route);
    this.addAction(ACTIONS.CONFIGURATION_DONE,configDone);
    this.addAction(ACTIONS.ROUTES_LOADED,     routesLoaded);
    this.addAction(ACTIONS.SET_ROUTING_DATA,  setRoutingData);
    this.addAction(ACTIONS.APP_READY,         appReady);
 }
   
  get statusCode () {
    return this._state.page.statusCode;
  }
   
  get doctypeHeader () {
    let header = '';
    
    if (this._state.page.docType === 'html5') {
      header = '<!doctype html>\n';
    }
    
    return header;
  }
  
  getPageTitle () {
    return this._state.meta.siteTitle;
  }
  
  isReady () {
    return this._state.request.route !== null;
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

function setDatabase (state, dbData) {

  if (mongoose.connection.readyState) {
    _appActions.dbConnected(mongoose.connection);
    return;    
  }

  // Object.assign(state.db, dbData);
  let db = dbData.database;
  let dbUrl = `mongodb://${db.host}:${db.port}/${db.name}`;

  mongoose.connect(dbUrl); 
  mongoose.connection.on('open', () => {
    _appActions.dbConnected(mongoose.connection);  
  });  
}

function dbConnected (state, db) {
  state.db.conn = db;  
}

function setRequest (state, request) {
  Object.assign(state.request, request);
}

function setThemeName (state, theme) {
  state.meta.theme = theme;
}

function setThemeHandler (state, ThemeHandler) {
  state.theme = ThemeHandler();
  console.log('Theme handler set');
}

function route () {
  console.log('appStore routing');
}

function configDone (state, domain) {
  state.meta.idDomain = domain._id;
  state.meta.theme    = domain.thm;
}

function routesLoaded (state, routes) {
  state.routes = routes;
}

function setRoutingData (state, data) {
  state.request.route = data;
}

function appReady (state, conn) {
  state.connection = conn;
  log.info('App is Ready');
  if (state.db.conn != null) {
    state.db.conn.close();
    console.log("DB closed.");    
  }
}

