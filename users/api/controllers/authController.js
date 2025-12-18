const bcrypt = require("bcrypt");

const db = require("../db");

const { userService } = require("../services")(db);

const authUtils = require("../utilities/authUtils");

exports.login = async (req, res) => {
    const { userID, password } = req.body;

    if (!userID || !password) {
        return res.status(400).json({ message: "Missing userID or password" });
    }

    let user;
    try {
        user = await userService.getUser(userID); 
    } catch (error) {

        if (error.name === "NotFoundError") {
        return res.status(401).json({ message: "User not found" });
        }
        return res.status(500).json({ message: "Internal server error" });
    }

    if (!bcrypt.compareSync(password, user.password)) {
        return res.status(401).json({ message: "Wrong password" });
    }

    const token = authUtils.generateUserToken(user);
    authUtils.setCookie(res, "user_token", token);

    return res.status(200).json({ token });
}

exports.status = (req, res, next) =>
{
    res.status(200).json(req.user);
}

exports.logout = (req, res, next) =>
{
    res.clearCookie("user_token");

    res.sendStatus(200);
}