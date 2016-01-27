'use strict';

let mach = require('mach');
let bootstrap = require('./server/bootstrap')();

let app = mach.stack();

app.use(mach.contentType, 'text/html');
app.use(mach.mapper, {
  '/': (conn) => {
    return bootstrap.render(conn);
  }
});
  
mach.serve(app, {port: 8880});

