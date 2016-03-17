'use strict';

// let m               = require('mithril');
// let mRender         = require('mithril-node-render');
// let log             = require('winston');


class NenyaRenderer {

  constructor (store) {
    this._appStore = store;
    // this._nHtml = new NenyaComponents.core.html.component(store);

  }

  render () {
    let state = this._appStore.getState();
    // let conn = state.request.conn;
    // let statusCode = this._appStore.statusCode;
    // let docHeader = this._appStore.doctypeHeader;
    // let vDom = m.component(this._nHtml.m());
    // let pageContent = mRender(vDom);   
    
    let nenyaTheme;
    
    // try {
      nenyaTheme = require('nenya-t-' + state.meta.theme)(this._appStore);
    // }
    // catch (e) {
      // console.log('Could not load theme ' + state.meta.theme);
      // console.dir(e.stack);
    // }
            
    return nenyaTheme.render();
  }
}



module.exports = NenyaRenderer;
