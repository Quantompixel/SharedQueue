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
        values (1, 'Daniel', '2345', 'nUx8Mhuw3Q4hJSQL4pPCIY66', '2023-06-15T18:26:01.815Z'),
               (2, 'Lukas', '1234', 'GBFpxrb48KxTeQKYTPAXOz3D', '2023-06-15T18:27:07.836Z');
    `);
}

module.exports = {
    createTables,
    connectToDatabase
}


