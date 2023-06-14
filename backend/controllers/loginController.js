const userRepository = require('../repository/userRepository');

const loginRequest = (req, res) => {
    // console.log(req.body.password);
    console.log(userRepository.getAll());
    res.json("logins");
}

module.exports =  {
    loginRequest
};
