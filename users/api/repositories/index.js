const ScoreRepository = require("./ScoreRepository");
const UserRepository = require("./UserRepository");

module.exports = (db) =>
{
    const userRepository = new UserRepository(db);

    const scoreRepository = new ScoreRepository(db);
    return { userRepository,scoreRepository };
}