class User {
    constructor(userId, username, password, sessionKey, sessionKeyExpiryDate) {
        this.userId = userId
        this.username = username;
        this.password = password;
        this.sessionKey = sessionKey;
        this.sessionKeyExpiryDate = sessionKeyExpiryDate;

        console.log(this.userId);
    }
}

module.exports = User;