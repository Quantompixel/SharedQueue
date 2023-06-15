class User {
    constructor(userId, username, password, sessionKey, sessionKeyExpiryDate) {
        this.userId = userId
        this.username = username;
        this.password = password;
        this.sessionKey = sessionKey;
        this.sessionKeyExpiryDate = sessionKeyExpiryDate;
    }
}

module.exports = User;