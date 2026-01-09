const ScoreService = require("./scoreService");
const UserService = require("./UserService")

module.exports = (db) =>
{
    const userService = new UserService(db);

    const scoreService = new ScoreService(db);

    return { userService,scoreService};
}