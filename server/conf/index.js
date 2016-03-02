'use strict';

module.exports = (store) => {
  return new NenyaConfigurator(store);
}



let assert      = require('assert');
let nFlux       = require('nenya-flux')();
let log         = require('winston');
let NenyaFluxit = require('../stores/abstract.flux');
let multisite   = require('nenya-multisite')(__dirname);
let Q           = require('q');

var mongoose    = require('mongoose');

let domainsList = [];

const ACTIONS       = require('../stores/app.actions');
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

const THEME_PREFIX = 'nenya-t-';

let _confActions = {};



let schDomain = mongoose.Schema({
    dom: String,
    thm: String
}, { collection: 'domains' });
let ModDomain = mongoose.model('Domain', schDomain, 'domains');



class NenyaConfigurator extends NenyaFluxit {

  makeActions () {
    // _confActions.getAppDomain  = nFlux.createAction(ACTIONS.GET_DOMAIN_CONFIG);
    _confActions.setAppEnv        = nFlux.createAction(ACTIONS.SET_ENVIRONMENT);
    _confActions.setAppDb         = nFlux.createAction(ACTIONS.SET_DATABASE);
    _confActions.setAppMeta       = nFlux.createAction(ACTIONS.SET_SITE_META);
    _confActions.setRequest       = nFlux.createAction(ACTIONS.SET_REQUEST);
    // _confActions.setThemeName     = nFlux.createAction(ACTIONS.SET_THEME_NAME);
    _confActions.setThemeHandler  = nFlux.createAction(ACTIONS.SET_THEME_HANDLER);
    _confActions.configDone       = nFlux.createAction(ACTIONS.CONFIGURATION_DONE);
    
    this._defaults = require(DEFAULTS_PATH); 
  }

  bindSubscriptions () {
    console.log('bindSubscriptions configurator');
    this.subscribeToAppStore(_configureLogger,    ACTIONS.SET_ENVIRONMENT);
    this.subscribeToAppStore(_configureDatabase,  ACTIONS.SET_ENVIRONMENT);
    this.subscribeToAppStore(_configureSiteMeta,  ACTIONS.SET_SITE_META);
    // this.subscribeToAppStore(_configureSiteTheme, ACTIONS.SET_THEME_NAME);
    this.subscribeToAppStore(_loadDbConfig,       ACTIONS.DB_CONNECTED);
  }

  configure (conn) {
    let hostName = conn.hostname;
    let requestedPath = conn.location.properties.pathname; 
    let config = this._defaults;
    let hostConfig = _getHostConfig(hostName);
    console.log("# PATH " + requestedPath);
    config.request = {
      conn: conn,
      path: requestedPath
    };
    
    Object.assign(config, hostConfig);
        
    if (config.request)  _confActions.setRequest(config.request);
    if (config.env.type) _confActions.setAppEnv(config.env.type);
    if (config.meta)     _confActions.setAppMeta(config.meta);
  }
}



function _configureLogger (store) {
  let state = store.getState();
  log.level = ENV_LOGLEVEL[state.env];
  log.info('Log level ' + state.env);
}

function _configureDatabase (store) {
  let state = store.getState();
  let dbConf = require('./env/' + state.env.toLowerCase() + '.conf');
  _confActions.setAppDb(dbConf);    
}

function _configureSiteMeta (store) {
  let addPageMeta = nFlux.createAction(ACTIONS.ADD_PAGE_META);
  let state = store.getState();
  let page = {
    title: state.meta.siteTitle,
    lang: "ro_RO"
  };
  
  addPageMeta(page);    
}
  
function _getHostConfig (hostName) {
  let domainData = {};

  let hostFile = hostName.replace('.', '_') + '.conf';
  let confPath = __dirname + '/hosts/';
  let hostConfPath = confPath + hostFile;

  if (typeof domainsList[hostFile] != 'undefined') {
    return domainsList[hostFile];
  }

  try {
    domainData = require(hostConfPath);
        
    if (domainData.meta) {
      domainData.meta.host = hostName;
    } 
    
    domainsList[hostFile] = domainData;
  }
  catch (e) {
    log.error(e.message);
    domainData = {
      status: 404,
      error: "The domain " + hostName + " is not configured on this server.<br/>" + hostConfPath
    };
  }

  if (typeof domainData != "object") {
    return {};
  }

  return domainData;
}

function _loadDbConfig (store) { 
  let state = store.getState();
  let db = mongoose.connection;

  ModDomain.findOne({dom: state.meta.host}, (err, domain) => {
      if (err) {
        log.debug('ERR ' + err);
        return;
      }
  
      _confActions.configDone(domain);        
  });
}

