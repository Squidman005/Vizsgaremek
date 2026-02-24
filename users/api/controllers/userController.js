const db = require("../db");
const jwt = require("jsonwebtoken");

const { userService } = require("../services")(db);

exports.getUsers = async (req, res, next) =>
{
    try
    {
        res.status(200).json(await userService.getUsers());
    }
    catch(error)
    {
        next(error);
    }
}

exports.getUser = async (req, res) => {
    const userFromToken = req.user;

    if (!userFromToken || !userFromToken.userID) {
        return res.status(401).json({ message: "Not authenticated" });
    }

    try 
    {
        const user = await userService.getUser(userFromToken.userID);
        return res.status(200).json(user);
    } 
    catch (error) 
    {
        console.error("Fetching user error:", error);
        if (error.name === "NotFoundError") {
        return res.status(404).json({ message: "User not found" });
        }
        return res.status(500).json({ message: "Internal server error" });
    }
};

exports.createUser = async (req, res, next) =>
{
    const { username, email, password } = req.body || {};

    try
    {
        res.status(201).json(await userService.createUser({ name: username, email, password }));
    }
    catch(error)
    {
        next(error);
    }
}

exports.updateUser= async (req,res,next)=>{
    const userID = req.userID;
    const{username,email,password} = req.body||{};
    try {
        const updatedUser =await userService.updateUser(userID,{username,email,password })
        res.status(200).json(updatedUser)
    } catch (error) {
        next(error)
    }
}

exports.updatePassword = async (req, res, next) => {
    console.log("req.user:", req.user);

    const userID = req.user.userID;  
    console.log("User ID from token:", userID);

    const { password } = req.body || {};

    try {
        const updatedPassword = await userService.updatePassword(password, userID);
        res.status(200).json(updatedPassword);
    } catch (error) {
        next(error);
    }
};


exports.deleteUser=async(req,res,nexr) =>{
    const userID = req.userID;
    try {
        await userService.deleteUser(userID);
        res.status(204).send()
    } catch (error) {
        next(error)
    }
}