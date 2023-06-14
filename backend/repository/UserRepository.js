const User = require('../models/User');
const {connectToDatabase} = require('../database');

// Call the connectToDatabase function to establish the connection
const db = connectToDatabase();

function getAll() {
    let users = [];

    db.all(`
        select user_id, username, password, session_key, session_key_expiry_date
        from user u
    `, (err, rows) => {
        for (let row of rows) {
            // console.log(row);
            users.push(
                new User(
                    row.user_id,
                    row.username,
                    row.password,
                    row.session_key,
                    row.session_key_expiry_date
                )
            );
        }

        return users;
    });

    return null;
}

module.exports = {
    getAll
}
