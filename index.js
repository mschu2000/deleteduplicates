"use strict";

process.title = 'deleteduplicates';

var fs = require('fs');
var nconf = require('nconf');
var glob = require("glob")

console.log('deleteduplicates.js');

var config = nconf
  .argv()
  .env()
  .file({ file: './config.json', format: require('hjson') })
  .get();

console.log(`directories: ${config.dir.candidates}, ${config.dir.archive}` );

// options is optional
var options = {
    "cwd": config.dir.candidates
};
glob(config.filefilter, options, function (er, files) {
  // files is an array of filenames.
  // If the `nonull` option is set, and nothing
  // was found, then files is ["**/*.js"]
  // er is an error object or null.
  console.log("Anzahl der Files = " + files.length);
  for (var i in files) {
      console.log(files[i]);
  }
})

