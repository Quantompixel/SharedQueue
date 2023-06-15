const sqlite3 = require('sqlite3');

let db;

function connectToDatabase() {
    db = new sqlite3.Database('./database.db', (err) => {
        if (err) {
            console.error(err.message);
        }
        console.log('Connected to the database.');
    });

    return db;
}

function createTables() {
    db.exec(`
        drop table if exists user;
        create table user
        (
            user_id                 int primary key not null,
            username                text            unique not null,
            password                text            not null,
            session_key             text,
            session_key_expiry_date text
        );
        insert into user (user_id, username, password, session_key, session_key_expiry_date)
        values (1, 'Daniel', '2345', 'asdfasdfads', '253245'),
               (2, 'Lukas', '1234', 'asdfasdfads', '253245');
    `);
}

module.exports = {
    createTables,
    connectToDatabase
}


