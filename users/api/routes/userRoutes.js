//a password reset utan a kiaditt userIDvel rendelkezo userre generalni kellene egy 7 karakterbol allo hash-t ami az uj jelszo lesz Ã©s B criptel titkositva

const express = require("express");

const router = express.Router();

const userController = require("../controllers/userController");

const authMiddleware = require("../middlewares/authMiddleware");

router.param("userID",(req,res,next,userID)=>{
    req.userID = userID;
    next()
})
router.get("/", [ authMiddleware.userIsLoggedIn, authMiddleware.isAdmin ], userController.getUsers);
router.get("/withpassword", [ authMiddleware.userIsLoggedIn, authMiddleware.isAdmin ], userController.getUsersWithPassword);

router.post("/", userController.createUser);

router.get("/:userID", userController.getUser);

router.patch("/:userID",userController.updateUser);

router.put("/password", authMiddleware.userIsLoggedIn, userController.updatePassword);

router.put("/username", authMiddleware.userIsLoggedIn, userController.updateUsername);

router.put("/password-reset", userController.resetPasswordByEmail);

router.delete("/:userID",userController.deleteUser)

module.exports = router;