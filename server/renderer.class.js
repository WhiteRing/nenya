'use strict';

let m               = require('mithril');
let mRender         = require('mithril-node-render');
let NenyaComponents = require('nenya-components');
let log             = require('winston');


class NenyaRenderer {

  constructor (store) {
    this._appStore = store;
    this._nHtml = new NenyaComponents.core.html.component(store);

  }

  render () {
    let state = this._appStore.getState();
    let conn = state.request.conn;
    let statusCode = this._appStore.statusCode;
    let docHeader = this._appStore.doctypeHeader;
    let vDom = m.component(this._nHtml.m());
    let pageContent = mRender(vDom);   
    
    return pageContent;
  }
}



module.exports = NenyaRenderer;
