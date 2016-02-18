'use strict';

module.exports = (store) => {
  return new NenyaConfigurator(store);
}



let nFlux       = require('nenya-flux')();
let log         = require('winston');
let NenyaFluxer = require('../stores/abstract.flux');
let multisite   = require('nenya-multisite')(__dirname);

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

let confActions = {};



class NenyaConfigurator extends NenyaFluxer {

  makeActions () {
    // confActions.getAppDomain  = nFlux.createAction(ACTIONS.GET_DOMAIN_CONFIG);
    confActions.setAppEnv   = nFlux.createAction(ACTIONS.SET_ENVIRONMENT);
    confActions.setAppDb    = nFlux.createAction(ACTIONS.SET_DATABASE);
    confActions.setAppMeta  = nFlux.createAction(ACTIONS.SET_SITE_META);
    
    this._defaults = require(DEFAULTS_PATH); 
  }

  bindSubscriptions () {
    this.subscribeToAppStore(_configureLogger,    ACTIONS.SET_ENVIRONMENT);
    this.subscribeToAppStore(_configureDatabase,  ACTIONS.SET_ENVIRONMENT);
    this.subscribeToAppStore(_configureSiteMeta,  ACTIONS.SET_SITE_META);
    this.subscribeToAppStore(_configureSiteTheme, ACTIONS.SET_SITE_META);
  }

  configure (hostName) {
    let config = this._defaults;
    let hostConfig = _getHostConfig(hostName);
      
    Object.assign(config, hostConfig);
        
    if (config.env.type) confActions.setAppEnv(config.env.type);
    if (config.meta)     confActions.setAppMeta(config.meta);
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
  confActions.setAppDb(dbConf);
}


function _configureSiteMeta (store) {
  let addPageMeta = nFlux.createAction(ACTIONS.ADD_PAGE_META);
  let state = store.getState();
  let page = {
    title: state.meta.siteTitle,
    lang: "ro_RO"
  };
  
  addPageMeta(page);
  
  log.info('Add metadata');
  log.debug(page)
  
}
  
function _configureSiteTheme (store) {
  let state = store.getState();
  let setTheme = nFlux.createAction(ACTIONS.SET_THEME);
   
  let themeName     = typeof state.meta.theme === "undefined" ? "default" : state.meta.theme;
  let themeHandler  = null;
  
  try {
    themeHandler = require(THEME_PREFIX + themeName); 
 } catch (e) {
    themeName = 'default';
    themeHandler = require(THEME_PREFIX + themeName); 
  }
  
  log.info('Use theme ' + themeName);
  console.log(state);
  
  setTheme(themeHandler);
  
  
}

function _getHostConfig (hostName) {
  let domainData = {};

  let hostFile = hostName.replace('.', '_') + '.conf';
  let confPath = __dirname + '/hosts/';
  let hostConfPath = confPath + hostFile;

  log.info("Load host data from " + hostConfPath);

  if (typeof domainsList[hostFile] != 'undefined') {
    return domainsList[hostFile];
  }

  try {
    domainData = require(hostConfPath);
        
    if (domainData.meta) {
      domainData.hostName = hostName;
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
