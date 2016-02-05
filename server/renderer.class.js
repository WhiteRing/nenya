'use strict';

let m               = require('mithril');
let mRender         = require('mithril-node-render');
let nComponents     = require('nenya-components');
console.log(nComponents);
let nButton = new nComponents.base.button.component({});

let MHtmlHead = {
  controller: () => {},
  view: () => {
    return m('head')
  }
}

let MHtmlBody = {
  controller: () => {},
  view: () => {
    return m('body', m.component(nButton.m()));
  }
}

let MHtml = {
  controller: () => {},
  view: () => {
    return m('html', [
      m.component(MHtmlHead),
      m.component(MHtmlBody),
    ]);
  }
}



class NenyaRenderer {
  
  constructor (store) {
    this._appStore = store;
  }
  
  render () {
    console.log('Renderer render');
    let conn = this._appStore.getState().connection;
    let statusCode = this._appStore.statusCode;
    let pageContent = mRender(MHtml.view());
    
    conn.html(statusCode, pageContent);    
  }
  
}



module.exports = NenyaRenderer;
