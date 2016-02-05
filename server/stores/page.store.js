'use strict';

let NenyaFlux = require('nenya-flux')();
let m = require('mithril');

module.exports = () => {
  let pageStore = NenyaFlux.createStore(initialState());
 
  pageStore.addAction('addMainSection', addMainSection);

  return pageStore;
}

function initialState() {
  return {
    docType: "html",
    vDom: initVDom()
  }
}

function initVDom() {
  console.log('initialState');
  return m('html', [
    m('head'),
    m('body', 'DOM')
  ]);
}

function addMainSection (state, payload) {
  console.log('addMainSection ');
  console.log(state);  
  console.log(payload);  
}
