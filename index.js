'use strict';

//
// Dependencies
//
const Hapi = require('hapi');
var bole = require('bole');
let bvDomains = require('nenya-domains')(__dirname);
// var m = require('mithril');
et bootstrap = require('./server/bootstrap')();

//
// Definitions
//
let log = bole('nenya');

bole.output({
  level: 'debug',
  stream: process.stdout
});



const server = new Hapi.Server();

server.connection({ port: 8880  });

server.route({
    method: 'GET',
    path: '/',
    handler: function (request, reply) {
      let domainData = {};
      try {
        domainData = bvDomains.getDomainConfig(request);
        console.log(domainData);
	bootstrap.renderPage(domainData, reply);
      }
      catch (e) {
        reply('Error 500: '+e);
        return;
      }
   }
});

server.start(() => {
    console.log('Server running at:', server.info.uri);
});


