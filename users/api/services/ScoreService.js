const { BadRequestError, NotFoundError } = require("../errors");

class ScoreService {
    constructor(db) {
        this.scoreRepository = require("../repositories")(db).scoreRepository;
    }

    async getScores() {
        return await this.scoreRepository.getScores();
    }
    
    async getScoresTopTen(gamename){
        return await this.scoreRepository.getScoresTopTen(gamename);
    }

    async getScore(scoreID) {
        if (!scoreID) throw new BadRequestError("Missing score identification from payload");
        const score = await this.scoreRepository.getScore(scoreID);
        if (!score) throw new NotFoundError("Cannot find score with this ID", { data: scoreID });
        return score;
    }

    async createScore(scoreData) {
        if (!scoreData) throw new BadRequestError("Missing score data", { data: scoreData });
        if (!scoreData.userId) throw new BadRequestError("Missing userId", { data: scoreData });
        if (scoreData.score === undefined) throw new BadRequestError("Missing score value", { data: scoreData });
        if (!scoreData.gamename) throw new BadRequestError("Missing gamename", { data: scoreData });
        return await this.scoreRepository.createScore(scoreData);
    }

    async updateScore(scoreID, scoreData) {
        if (!scoreID) throw new BadRequestError("Missing score ID");
        if (!scoreData || Object.keys(scoreData).length === 0) throw new BadRequestError("Missing score data", { data: scoreID });
        return await this.scoreRepository.updateScore(scoreData, scoreID);
    }

    async deleteScore(scoreID) {
        if (!scoreID) throw new BadRequestError("Missing score ID");
        const score = await this.scoreRepository.deleteScore(scoreID);
        if (!score) throw new NotFoundError("Cannot find score with this ID", { data: scoreID });
        return { success: true };
    }
}

module.exports = ScoreService;
