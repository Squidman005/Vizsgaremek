const express = require ("express");

const router = express.Router();

const scoreController = require("../controllers/scoreController");

router.get("/", scoreController.getScores);

// get játéknév szerint csökkenő sorrendbe top 10

router.get("/:gamename",scoreController.getScoresTopTen)
router.param("gamename", (req, res, next, userID) => 
{
    req.userID = userID;

    next();
});

// get játékosnév szerint minden játékhoz csak a legnagyobbat

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