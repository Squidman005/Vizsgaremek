const{Model,DataTypes} = require("sequelize");

module.exports=(sequelize)=>{
    class Score extends Model{};

    Score.init(
        {
            ID:{
                type:DataTypes.INTEGER,
                primaryKey:true,
                autoIncrement:true,
                allowNull:false,
                
            },
            userId:{
                type:DataTypes.STRING,
                allowNull:false,
            },
            score:{
                type:DataTypes.INTEGER,
                allowNull:false,
                defaultValue:0,
            },
            gamename:{
                type:DataTypes.STRING,
                allowNull:false,
            }
        },
        {
            sequelize,
            modelName: "Score",
            createdAt: false,
            updatedAt: false,
        },
    );
    return Score;
}