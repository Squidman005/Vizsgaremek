const express = require("express");

const router = express.Router();

const userController = require("../controllers/userController");

const authMiddleware = require("../middlewares/authMiddleware");

router.get("/", [ authMiddleware.userIsLoggedIn, authMiddleware.isAdmin ], userController.getUsers);

router.post("/", userController.createUser);
router.param("userID",(req,res,next,userID)=>{
    req.userID = userID;
    next()
})

router.get("/", userController.getUser);

router.put("/",userController.updateUser);

router.put("/password", authMiddleware.userIsLoggedIn, userController.updatePassword);

router.delete("/",userController.deleteUser)

module.exports = router;