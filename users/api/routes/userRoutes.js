const express = require("express");

const router = express.Router();

const userController = require("../controllers/userController");

const authMiddleware = require("../middlewares/authMiddleware");

router.get("/", [ authMiddleware.userIsLoggedIn, authMiddleware.isAdmin ], userController.getUsers);

router.post("/", userController.createUser);

router.get("/", userController.getUser);

module.exports = router;