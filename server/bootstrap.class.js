'use strict';

// const STATUS_CODES  = require('./conf/status-codes.conf');
// const ACTIONS       = require('./stores/app.actions');
const CONF_PATH     = './conf';



let nFlux           = require('nenya-flux')();
let Q               = require('q');
let AppStore        = require('./stores/app.store');
let NenyaRouter     = require('./router.class');
let NenyaRenderer   = require('./renderer.class');
let Configurator    = require(CONF_PATH);



class NenyaBootstrap {
    
  constructor () {
    this._appStore      = AppStore({});
    this._subscription  = nFlux.createSubscription(this._appStore);
    this._configurator  = Configurator(this._subscription);
    this._router        = NenyaRouter(this._subscription);
    this._renderer      = new NenyaRenderer(this._appStore);        
  }
    
  boot (conn) {
    var deferred = Q.defer();
          
    this._appStore.resetState();
    this._configurator.configure(conn);

    let self = this;
    
    this._wait = setInterval(() => {
      console.log(',');
      
      if (self._appStore.isReady()) {
        console.log('.');
        clearInterval(self._wait);
        deferred.resolve(self._renderer.render());
      }
    }, 100);
    
    return deferred.promise;    
  }
}



module.exports = NenyaBootstrap;

