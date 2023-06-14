const sqlite3 = require('sqlite3');

let db = new sqlite3.Database('./database.db', (err) => {
    if (err) {
        console.error(err.message);
    }
    console.log('Connected to the my database.');
    createTables(db);
});

function createTables(db) {
    db.exec(`
        drop table if exists user;

        create table user
        (
            user_id                 int primary key not null,
            username                text            not null,
            password                text            not null,
            session_key             text,
            session_key_expiry_date text
        );

        insert into user (user_id, username, password, session_key, session_key_expiry_date)
        values (1, 'Daniel', '1234', 'asdfasdfads', '253245'),
               (2, 'Lukas', '1234', 'asdfasdfads', '253245');
    `, () => {
        runQueries(db);
    });
}

function runQueries(db) {
    db.all(`
        select username, password
        from user u
    `, (err, rows) => {
        rows.forEach(row => {
            console.log(row.username + "\t" +
                row.password);
        });
    });
}