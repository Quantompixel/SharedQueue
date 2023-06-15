const userRepository = require('../repository/userRepository');
const ApiError = require('../apiError');

const loginRequest = (req, res, next) => {
    try {
        if (!req.body.username && !req.body.password) {
            throw new ApiError("Password and username not defined", 400);
        }

        if (!req.body.username) {
            throw new ApiError("Username not defined", 400);
        }

        if (!req.body.password) {
            throw new ApiError("Password not defined", 400);
        }

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
    } catch (err) {
        next(err);
    }
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
