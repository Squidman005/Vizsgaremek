const { BadRequestError, NotFoundError } = require("../errors");

class ScoreService{
    constructor(db){
        this.scoreRepository = require("../repositories")(db).userRepository;
    }
    async getScores()
    {
        return await this.scoreRepository.getScores();
    }
    async getScore(scoreID)
    {
        if(!scoreID) throw new BadRequestError("Missing score identification from payload");

        const score = await this.scoreRepository.getScore(scoreID);

        if(!score) throw new NotFoundError("Can not found score with this score identification", 
        {
            data: scoreID
        });

        return score;
    }
    async createScore(scoreData){
        if(!scoreData){
            throw new BadRequestError("Missing user data from payload", 
            {
                data:scoreData
            })
        }
        if(!scoreData.scoreID) throw new BadRequestError("Missing score from payload",
        {
            data: scoreData,
        });
        if(!scoreData.userID) throw new BadRequestError("Missing user from payload",
        {
            data: scoreData,
        });
        if(!scoreData.score) throw new BadRequestError("Missing score value from payload",
        {
            data: scoreData,
        });
        if(!scoreData.gamename) throw new BadRequestError("Missing game name from payload",
        {
            data: scoreData,
        });

        return await this.scoreRepository.createScore(scoreData);
    }
    async updateScore(scoreID,scoreData){
        if(!scoreID)throw new BadRequestError("Missing score identification from payload!");
        if(!scoreData|| Object.keys(scoreData).length===0)throw new BadRequestError("Missing score data from payload",{data:scoreID});
        return await this.scoreRepository.updateScore(scoreID,scoreData);

    }

    async deleteScore(scoreID){
        if(!scoreID) throw new BadRequestError("Missing score identification from payload");

        const score = await this.scoreRepository.deleteScore(scoreID);

        if(!score) throw new NotFoundError("Can not found score with this score identification",
        {
            data: scoreID
        });

        await this.scoreRepository.deleteScore(scoreID);
        return { success: true };
    }

}
module.exports = ScoreService;