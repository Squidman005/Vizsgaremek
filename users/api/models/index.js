module.exports = (sequelize) => {
    const User = require("./User")(sequelize);
    const Score = require("./Score")(sequelize);

    User.belongsToMany(Score, {
        through: "UserScores",
        as: "scores",
        foreignKey: "userId",
        otherKey: "scoreId",
    });

    Score.belongsToMany(User, {
        through: "UserScores",
        as: "users",
        foreignKey: "scoreId",
        otherKey: "userId",
    });

    return { User, Score };
};
