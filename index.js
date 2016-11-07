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

console.log(`directories: ${config.DDUP_ARCHIVE}, ${config.DDUP_CANDIDATES}`);


Promise.all([
    glob(config.DDUP_FILEFILTER, { "cwd": config.DDUP_ARCHIVE }),
    glob(config.DDUP_FILEFILTER, { "cwd": config.DDUP_CANDIDATES }),
    fsp.ensureDir(config.DDUP_NEW)
]).then(values => {
    console.log(values);
    let [candidatesFiles, archiveFiles] = values;
    let newFiles = archiveFiles.filter(x => !candidatesFiles.includes(x));
    console.log("newFiles");
    console.log(newFiles);
    for (let newFile of newFiles) {
        console.log("move " + config.DDUP_CANDIDATES + newFile + " to " + config.DDUP_NEW + newFile);
        fsp.move(config.DDUP_CANDIDATES + newFile, config.DDUP_NEW + newFile);
    }
    console.log(`alles fertig: ${archiveFiles.length} archive files und ${candidatesFiles.length} candidates und davon sind ${newFiles.length} Dateien neu`);
}).catch(
    reason => console.log(reason)
);