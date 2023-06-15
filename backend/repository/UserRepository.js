const User = require('../models/User');
const {connectToDatabase} = require('../database');

// Call the connectToDatabase function to establish the connection
const db = connectToDatabase();

function updateSessionKeyForUser(sessionKey, expiryDateTime, username) {
    let data = [sessionKey, expiryDateTime, username];
    let sql = `
        UPDATE user
        SET session_key = ?, session_key_expiry_date = ?
        where username = ?
    `;

    getByUsername(username)
        .then(() => {
            db.run(sql, data, (err) => {
                if (err) {
                    return console.error(err);
                }
            })

        })
}

function getByUsername(username) {
    return new Promise((resolve, reject) => {
        getAll()
            .then(users => {
                for (let user of users) {
                    if (user.username === username) {
                        resolve(user);
                    }
                }
            })
            .catch(error => {
                reject(error);
            });
    });
}

function getAll() {
    return new Promise((resolve, reject) => {
        let users = [];

        db.all(
            `
                SELECT user_id, username, password, session_key, session_key_expiry_date
                FROM user u
            `,
            (err, rows) => {
                if (err) {
                    reject(err);
                    return;
                }

                for (let row of rows) {
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

                resolve(users);
            }
        );
    });
}

module.exports = {
    getByUsername,
    updateSessionKeyForUser
}
