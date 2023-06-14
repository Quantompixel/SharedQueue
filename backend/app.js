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
        create table user
        (
            user_id                 int primary key not null,
            username                text            not null,
            password                text            not null,
            session_key             text,
            session_key_expiry_date text
        );
    `, () => {
        runQueries(db);
    });
}

function runQueries(db) {
    db.all(`
        select hero_name, is_xman, was_snapped
        from hero h
                 inner join hero_power hp on h.hero_id = hp.hero_id
        where hero_power = ?`, "Total Nerd", (err, rows) => {
        rows.forEach(row => {
            console.log(row.hero_name + "\t" +
                row.is_xman + "\t" +
                row.was_snapped);
        });
    });
}