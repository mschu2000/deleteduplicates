"use strict";

process.title = 'deleteduplicates';

var nconf = require('nconf');
var glob = require("glob-promise");
var async = require('async');

console.log('deleteduplicates.js');

var config = nconf
    .argv()
    .env()
    .file({ file: './config.json', format: require('hjson') })
    .get();

var asyncTasks = [];

console.log(`directories: ${config.dir.candidates}, ${config.dir.archive}`);

// options is optional
var options = {
    "cwd": config.dir.candidates
};



let lese_verzeichnis = () => function() {
    return new Promise((resolve) => {
        glob(config.filefilter, options)
            .then(function(files) {
                // files is an array of filenames.
                // If the `nonull` option is set, and nothing
                // was found, then files is ["**/*.js"]
                // er is an error object or null.
                console.log("Anzahl der Files = " + files.length);
                for (var i in files) {
                    console.log(files[i]);
                }
                resolve(files.length);
            });
    });
};

let myWait3Sec = () => function() {
    return Promise((resolve) => {
        // Set a timeout for 3 seconds
        setTimeout(function() {
            // It's been 3 seconds, alert via callback
            console.log('3 Sek sind um!');
            resolve(3);
        }, 3000);
    });
};

Promise.all([lese_verzeichnis(), myWait3Sec()]).then(values => {
    console.log(values); // [3, 1337, "foo"]
    //let [anz_files, anz_sekunden] = values;
    let anz_files = values[0];
    let anz_sekunden = values[1];
    console.log(`alles fertig: anz_files = ${anz_files} gelesen in ${anz_sekunden} Sekunden`);
});