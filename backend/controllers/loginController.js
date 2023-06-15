const userRepository = require('../repository/userRepository');

const loginRequest = (req, res) => {
    userRepository.getByUsername(req.body.username)
        .then(user => {
            if (user.password === req.body.password) {
                res.json(JSON.stringify({
                    sessionKey: generateSessionKey()
                }));
            } else {
                res.json("not logged in");
            }
        });
}

function generateSessionKey(length = 24) {
    const pool = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let sessionKey = "";

    for (let i = 0; i < length; i++) {
        let random = Math.floor(Math.random() * pool.length) + 1;
        sessionKey += [random];
    }

    return sessionKey;
}

module.exports = {
    loginRequest
};
