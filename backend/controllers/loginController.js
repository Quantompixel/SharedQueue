const userRepository = require('../repository/userRepository');

const loginRequest = (req, res) => {
    // console.log(req.body.password);
    userRepository.getAll()
        .then(users => {
            console.log(users); // Process the retrieved users here
        })
        .catch(error => {
            console.error(error); // Handle any errors
        });

    res.json("logins");
}

module.exports = {
    loginRequest
};
