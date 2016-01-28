'use strict';

let domainStore = require('../stores/domain.store')();
let nFlux = require('nenya-flux')();
let mRender = require('mithril-node-render');
let m = require('mithril');
let nDomains = require('nenya-domains')(__dirname + '../');

let actionType = domainStore.actions.ADD_DOMAIN_CONFIG;
let actionDomainData = nFlux.createAction(actionType);
let subscription = nFlux.createSubscription(domainStore);
let content = '';


subscription(renderOutput);
 
module.exports = () => {
  return {
    render
  };
};

function renderOutput (store) {
  let theme = null;
  let domainData = store.getState().domain;
  let output = '';

  if (domainData.theme) {
    try {
      theme = require('nenya-theme-' + domainData.theme);
    }
    catch (err) {
      console.log(err);
      log.warn('Theme "'+domainData.theme+'" not found. Switched to default.')
      theme = require('nenya-theme-default');
    }
  }

  content = mRender(m('html', [
    m('head', [
      m('title', domainData.title)
//      m('link', {rel: 'shortcut icon', type: 'image/png', href: 'favicon.png'})
    ]),
    m('body', m.component(theme(domainData)))
  ]));
}

function render (conn) {
  let output = conn.hostname;

  let data = {
    domain: nDomains.getDomainConfig(conn.hostname)
  }

  output += actionDomainData(data);


//  console.log(output);
//      reply(output + '<pre>' + JSON.stringify(request.info) + '</pre>'); 
 
  conn.html(200, content);

/*  conn.status = 200;
  conn.response.contentType = 'text/html';
  conn.response.content = content;
*/
  return content;
}

function htmlSkeleton () {
 
}

