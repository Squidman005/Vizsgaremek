const db = require("../db");


const { scoreService } = require("../services")(db);

exports.getScores = async (req, res, next) =>
{
    try
    {
        res.status(200).json(await scoreService.getScores());
    }
    catch(error)
    {
        next(error);
    }
}
exports.getScore = async (req, res, next) =>
{
    const scoreID = req.scoreID;

    try
    {
        res.status(200).json(await scoreService.getUser(scoreID));
    }
    catch(error)
    {
        next(error);
    }
}

exports.createScore = async (req, res, next) =>
{
    const { scoreID,userID, score, gamename } = req.body || {};

    try
    {
        res.status(201).json(await scoreService.createUser({ scoreID,userID,score,gamename}));// itt nem vagyok biztos hogy így kell megadni
    }
    catch(error)
    {
        next(error);
    }
}

exports.updateScore = async (req, res, next) =>
{
    const scoreID = req.scoreID;
    const {userID,score,gamename  } = req.body || {};

    try
    {
        const updatedScore = await scoreService.updateUser(scoreID, {
            scoreID: scoreID,
            score: score,
          gamename //ez meg marad,  meg a userID is
        });

        res.status(200).json(updatedScore);
    }
    catch (error)
    {
        next(error);
    }
};

exports.deleteScore = async (req, res, next) =>
{
    const scoreID = req.scoreID;

    try
    {
        await scoreService.deleteScore(scoreID);
        res.status(204).send();
    }
    catch (error)
    {
        next(error);
    }
};