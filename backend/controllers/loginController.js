const loginRequest = (req, res) => {
    console.log(req.body.password);
    res.json("logins");
}

module.exports =  {
    loginRequest
};
