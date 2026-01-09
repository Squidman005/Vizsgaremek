const express = require ("express");

const router = express.Router();

const scoreController = require("../controllers/scoreController");

router.get("/", scoreController.getScores);

router.post("/",scoreController.createScore);

router.put("/",scoreController.updateScore);

router.delete("/",scoreController.deleteScore)

router.param("scoreID", (req, res, next, scoreID) => 
{
    req.scoreID = scoreID;

    next();
});

router.get("/:scoreID", scoreController.getScore);

module.exports = router;