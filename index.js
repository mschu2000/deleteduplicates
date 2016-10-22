"use strict";

process.title = 'deleteduplicates';

const nconf = require('nconf');
const glob = require("glob-promise");
const fsp = require("fs-promise");

console.log(`Starting ${process.title}`);

const config = nconf
    .argv()
    .env()
    .file({ file: './config.json', format: require('hjson') })
    .get();

console.log(`directories: ${config.dir.archive}, ${config.dir.candidates}`);

Promise.all([
    glob(config.filefilter, { "cwd": config.dir.archive }),
    glob(config.filefilter, { "cwd": config.dir.candidates }),
    fsp.ensureDir(config.dir.new)
]).then(values => {
    console.log(values);
    let [candidatesFiles, archiveFiles] = values;
    let newFiles = archiveFiles.filter(x => !candidatesFiles.includes(x));
    console.log("newFiles");
    console.log(newFiles);
    for (let newFile of newFiles) {
        console.log("move " + config.dir.candidates + newFile + " to " + config.dir.new + newFile);
        fsp.move(config.dir.candidates + newFile, config.dir.new + newFile );
    }
    console.log(`alles fertig: ${archiveFiles.length} archive files und ${candidatesFiles.length} candidates und davon sind ${newFiles.length} Dateien neu`);
}).catch(
    reason => console.log(reason)
);