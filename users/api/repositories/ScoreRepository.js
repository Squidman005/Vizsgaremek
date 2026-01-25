const {DbError}= require("../errors");

const { Op} = require("sequelize");

class ScoreRepository{
    constructor(db){
        this.Score = db.Score;
        this.sequelize = db.sequelize;
    }

    async getScores(){
        try {
            return await this.Score.scope(["public"]).findAll();
        } catch (error) {
            throw new DbError("Failed to fetc users",{
                details:error.message,
            });
        }
    }
    
    async getScoresTopTen(gamename){
        try {
            return await this.Score.scope(["public"]).findAll({
                where:{
                    gamename:{[Op.eq]:gamename}
                },
                order:[
                    ["score","DESC"],
                ],
                limit: 10,
            });
        } catch (error) {
            throw new DbError("Failed to fetc users",{
                details:error.message,
            });
        }
    }

    async getScore(scoreID){
        try {
            return await this.Score.scope(["public"]).findOne({
                where:{
                    [Op.or]:[{ID:scoreID},{userID:scoreID},{score:scoreID},{gamename:scoreID}]
                }
            });
        } catch (error) {
            throw new DbError("Failed to fetch score",{
                details:error.message,
                data:scoreID,
            });
        }
    }
    async createScore(scoreData){
        try {
            return await this.Score.create(scoreData)
        } catch (error) {
            throw new DbError("Failed to create score object",{
                details:error.message,
                data:scoreData,
            })
        }
    }
    async deleteScore(scoreID){
        try {
             return await this.Score.destroy({
                where:{
                    [Op.or]:[{ID:scoreID},{userID:scoreID},{score:scoreID},{gamename:scoreID}]
                }
            });
        } catch (error) {
            throw new DbError("Failed to delete score from database",{
                details:error.sqlMessage,
                data:{scoreID},
            });
        }
    }
    async updateScore(scoreData, scoreID=scoreData.ID){
        try {
            return await this.Score.update({...scoreData},{
                where:{
                    ID:scoreID,
                }
            });
        } catch (error) {
            throw new DbError("Failed to update score,",{
                details:error.message,
                data:{scoreData},
            });
        }
    }
}
module.exports=ScoreRepository;