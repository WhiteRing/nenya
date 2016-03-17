'use strict';

const ACTIONS   = require('./stores/app.actions');

let assert      = require('assert');
let log         = require('winston');
let mongoose    = require('mongoose');
let nenyaFlux   = require('nenya-flux')();
let NenyaFluxit = require('./stores/abstract.flux');

let _routeActions = {};

let schRoute = mongoose.Schema({
    dom: mongoose.Schema.ObjectId,
    ptn: String,
    wrp: String
}, { collection: 'routes' });
let ModRoute = mongoose.model('Route', schRoute, 'routes');



class NenyaRouter extends NenyaFluxit {
  
  makeActions () {
    _routeActions.routesLoaded    = nenyaFlux.createAction(ACTIONS.ROUTES_LOADED);
    _routeActions.setRoutingData  = nenyaFlux.createAction(ACTIONS.SET_ROUTING_DATA);
  }

  bindSubscriptions () {
    console.log('bindSubscriptions NenyaRouter');
    this.subscribeToAppStore(_route, ACTIONS.CONFIGURATION_DONE);
    this.subscribeToAppStore(_routesLoaded, ACTIONS.ROUTES_LOADED);
  }
}



module.exports = (store) => {
  return new NenyaRouter(store);
}



function _route (store) {
  let state    = store.getState();
  let db = mongoose.connection;
  assert.notEqual(db, null);

  let findRoutes = {
    $or:[
      {dom: state.meta.idDomain},
      {dom: null}
    ]
  }; 
  
  ModRoute.find(findRoutes, (err, routes) => {
    if (err) {
      console.log(err);
      return;
    }
    _routeActions.routesLoaded(routes);      
  });  
}

function _routesLoaded (store) {
  let state = store.getState();
  let matchedRoute = null;
  let page = 'home';
  let db = mongoose.connection;
  let routingData = {
    wrapper: ''
  };
   
  let arrRequest = state.request.path.split('/');
  arrRequest.splice(0, 1);
  
  //
  // TODO: First search for full requested path in db
  //
  
  if (arrRequest.length > 0) {
    if (arrRequest.length === 1 && arrRequest[0] === '') {
      matchedRoute = 'home';
    } else {
      let requestedPage = '/' + arrRequest[0];
      let filterRoute = state.routes.filter((route) => {
        let arrRoute = route.ptn.split('/');
        arrRoute.splice(0,1);
        if (arrRoute.length && arrRoute[0] == '') {
          arrRoute.splice(0,1);
        }
        return arrRoute.length == arrRequest.length;
        // return route.ptn == requestedPage;
      });
      
      matchedRoute = filterRoute.length > 0 ? filterRoute[0] : "404";
    }
  }
  
  console.log(matchedRoute);
  
  // test entity
  let entity = '';

  if (matchedRoute != '404' && matchedRoute != 'home') {
    let arrRoute = matchedRoute.ptn.split('/');
    arrRoute.splice(0,1);
    if (arrRoute.length == 1) {
      let strRoute = arrRoute[0];
      
      if (strRoute[0] == ':') {
        entity = strRoute.substring(1, strRoute.length);
      }
    }
    
    let schEntity = mongoose.Schema({
        rute: String,
    }, { collection: entity });
    let ModEntity = mongoose.model(entity, schEntity, entity);
    
    let res = ModEntity.count({rute: arrRequest[0]}, (err, entityCount) => {
      if (entityCount >= 1) {
        // action to set matched route
        routingData.wrapper = matchedRoute.wrp;
        routingData.entity = entity;
        routingData.value = arrRequest[0];
        
        _routeActions.setRoutingData(routingData); 
      } else {
        matchedRoute = '404';
      }
    });      
  }
  
  if (typeof matchedRoute == 'string') {
    routingData.wrapper = matchedRoute;
  } else {
    routingData.wrapper = matchedRoute.wrp;
  }
  console.log(routingData);

  if (matchedRoute == '404' || matchedRoute == 'home') {
    _routeActions.setRoutingData(routingData); 
  }
}

