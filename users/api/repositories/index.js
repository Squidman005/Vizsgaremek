const ScoreRepository = require("./scoreRepository");
const UserRepository = require("./UserRepository");

module.exports = (db) =>
{
    const userRepository = new UserRepository(db);

    const scoreRepository = new ScoreRepository(db);
    return { userRepository,scoreRepository };
}