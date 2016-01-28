'use strict';

let mach = require('mach');
let bootstrap = require('./server/bootstrap')();

let app = mach.stack();

app.use(mach.gzip);
app.use(mach.logger);
app.use(mach.modified);
app.use(mach.file, {
  root: __dirname + '/client/',
  autoIndex: false,
  useLastModified: true,
  useETag: true
});

  app.use(mach.contentType, 'text/html');
  app.use(mach.favicon);
app.run((conn) => {
  console.log('RUN');

  bootstrap.render(conn);
});

mach.serve(app, {port: 8880});
