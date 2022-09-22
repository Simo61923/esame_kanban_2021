'use strict';

const sqlite = require('sqlite3').verbose();

const DBSOURCE = './db/kanban.db';

const db = new sqlite.Database(DBSOURCE, (err) => {
    if (err) {
        // Cannot open database
        console.error(err.message);
        throw err;
    }
    db.exec('PRAGMA foreign_keys = ON;', (error) => {
        if (error){
            console.error("Pragma statement didn't work.")
        } else {
            console.log("Foreign Key Enforcement is on.")
        }
    });
});

module.exports = db;
