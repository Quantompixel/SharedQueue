const sqlite3 = require('sqlite3');

let db;

function connectToDatabase() {
    db = new sqlite3.Database('./database.db', (err) => {
        if (err) {
            console.error(err.message);
        }
    });

    return db;
}

function createTables() {
    db.exec(`
        drop table if exists user;
        drop table if exists queue;
        drop table if exists entry;

        create table user
        (
            user_id                 int primary key not null,
            username                text unique     not null,
            password                text            not null,
            session_key             text,
            session_key_expiry_date text
        );

        create table queue
        (
            queue_id int primary key not null,
            name     text
        );

        create table entry
        (
            entry_id int primary key not null,
            queue_id int             not null,
            title    text
        );

        insert into user (user_id, username, password, session_key, session_key_expiry_date)
        values (1, 'Daniel', '2345', 'dg6sf8_3s0ywjdtrqhu283hk', '2023-07-15T18:26:01.815Z'),
               (2, 'Lukas', '1234', 'jm92zesn5aolbg_p8u9tb26w', '2023-07-15T18:27:07.836Z');

        insert into queue (queue_id, name)
        values (1, 'SharedQueue');

        insert into entry (entry_id, queue_id, title)
        values (1, 1, 'one'),
               (2, 1, 'two'),
               (3, 1, 'three'),
               (4, 1, 'four'),
               (5, 1, 'five');
    `);
}

module.exports = {
    createTables,
    connectToDatabase
}


