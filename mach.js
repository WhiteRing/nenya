'use strict';

let mach = require('mach');
let Bootstrap = require('./server/bootstrap.class');
let Q = require('q');

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
app.run(Q.async(function * (request) {
  let response = yield bootstrap.boot(request);
  return response;
}));


mach.serve(app, {port: 8880});
