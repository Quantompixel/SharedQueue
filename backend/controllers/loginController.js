require('dotenv').config()
const userRepository = require('../repository/userRepository');
const ApiError = require('../apiError');

const sessionKeyExpiryDuration = process.env.SESSION_KEY_EXPIRY_DURATION;

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
                    const sessionKey = generateSessionKey();
                    const expiryDateTime = generateExpiryDateTimeString();

                    userRepository.updateSessionKeyForUser(sessionKey, expiryDateTime, req.body.username);

                    res.json({
                        sessionKey: sessionKey,
                        expiryDateTime: expiryDateTime
                    });
                } else {
                    throw new ApiError("Login credentials are incorrect", 401);
                }
            }).catch((err) => {
                next(err);
        });
    } catch (err) {
        next(err);
    }
}

function generateExpiryDateTimeString() {
   return new Date(Date.now() + Number(sessionKeyExpiryDuration)).toISOString();
}

function generateSessionKey(length = 24) {
    const pool = 'abcdefghijklmnopqrstuvwxyz0123456789_';
    let sessionKey = "";

    for (let i = 0; i < length; i++) {
        let random = Math.floor(Math.random() * pool.length);
        sessionKey += pool[random];
    }

    return sessionKey;
}

module.exports = {
    loginRequest
};
