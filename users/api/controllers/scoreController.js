const db = require("../db");
const ScoreService = require("../services/ScoreService");
const scoreService = new ScoreService(db);

exports.getScores = async (req, res, next) => {
    try {
        const scores = await scoreService.getScores();
        res.status(200).json(scores);
    } catch (error) {
        next(error);
    }
};

exports.getScore = async (req, res, next) => {
    const scoreID = req.scoreID;
    try {
        const score = await scoreService.getScore(scoreID);
        res.status(200).json(score);
    } catch (error) {
        next(error);
    }
};
exports.getScoresTopTen=async(req,res,next)=>{
    const gamename = req.gamename;
     try {
        const scores = await scoreService.getScoresTopTen(gamename);
        res.status(200).json(scores);
    } catch (error) {
        next(error);
    }
}
exports.createScore = async (req, res, next) => {
    const { userId, score, gamename } = req.body || {};
    try {
        const newScore = await scoreService.createScore({ userId, score, gamename });
        res.status(201).json(newScore);
    } catch (error) {
        next(error);
    }
};

exports.updateScore = async (req, res, next) => {
    const scoreID = req.scoreID;
    const { userId, score, gamename } = req.body || {};
    try {
        const updatedScore = await scoreService.updateScore(scoreID, { userId, score, gamename });
        res.status(200).json(updatedScore);
    } catch (error) {
        next(error);
    }
};

exports.deleteScore = async (req, res, next) => {
    const scoreID = req.scoreID;
    try {
        await scoreService.deleteScore(scoreID);
        res.status(204).send();
    } catch (error) {
        next(error);
    }
};
