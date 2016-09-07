"use strict";

process.title = 'deleteduplicates';

var fs = require('fs');
var nconf = require('nconf');
var glob = require("glob");
var async = require('async');

console.log('deleteduplicates.js');

var config = nconf
  .argv()
  .env()
  .file({ file: './config.json', format: require('hjson') })
  .get();

var asyncTasks = [];

console.log(`directories: ${config.dir.candidates}, ${config.dir.archive}`);

asyncTasks.push(function (callback) {
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
  });
  callback(); // für async.parallel
}
);

asyncTasks.push(function(callback){
  // Set a timeout for 3 seconds
  setTimeout(function(){
    // It's been 3 seconds, alert via callback
    console.log('3 Sek sind um!');
    callback();
  }, 3000);
});
 
// Now we have an array of functions doing async tasks
// Execute all async tasks in the asyncTasks array
async.parallel(asyncTasks, function(){
  // All tasks are done now
  console.log('Alles fertig, weiter geht es!');
});

