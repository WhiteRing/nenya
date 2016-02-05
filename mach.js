'use strict';

let mach = require('mach');
let Bootstrap = require('./server/bootstrap.class');

let app = mach.stack();

app.use(mach.gzip);
// app.use(mach.logger);
app.use(mach.modified);
app.use(mach.file, {
  root: __dirname + '/client/',
  autoIndex: false,
  useLastModified: true,
  useETag: true
});

let bootstrap = new Bootstrap();

app.use(mach.contentType, 'text/html');
app.use(mach.favicon);
app.run((conn) => {
  // mach.logger(conn);
  bootstrap.boot(conn);
});

mach.serve(app, {port: 8880});
