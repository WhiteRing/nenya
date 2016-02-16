'use strict';

let m               = require('mithril');
let mRender         = require('mithril-node-render');
let NenyaComponents = require('nenya-components');
let log             = require('winston');

let nButton 		= new NenyaComponents.base.button.component({});



class NenyaRenderer {

  constructor (store) {
    this._appStore = store;
    this._nHtml = new NenyaComponents.core.html.component(store);

  }

  render () {
    log.info('Renderer render');
    let conn = this._appStore.getState().connection;
    let statusCode = this._appStore.statusCode;
    let vDom = m.component(this._nHtml.m());
    let pageContent = mRender(vDom);

    conn.html(statusCode, pageContent);
  }

}



module.exports = NenyaRenderer;
