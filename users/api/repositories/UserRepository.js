const { DbError } = require("../errors");
const bcrypt = require("bcrypt");
const { Op } = require("sequelize");
const authUtils = require("../utilities/authUtils");

class UserRepository
{
    constructor(db)
    {
        this.User = db.User;

        this.sequelize = db.sequelize;
    }

    async getUsers()
    {
        try
        {
            return await this.User.scope(["public"]).findAll();
        }
        catch(error)
        {
            throw new DbError("Failed to fetch users", 
            {
                details: error.message,
            });
        }
    }

    async getUsersWithPassword()
    {
        try
        {
            return await this.User.scope(["withPassword"]).findAll();
        }
        catch(error)
        {
            throw new DbError("Failed to fetch users", 
            {
                details: error.message,
            });
        }
    }

    async getUser(userID) {
        try {
            return await this.User.scope(['withPassword']).findOne({
                where: {
                    [Op.or]: [{ name: userID }, { email: userID }],
                },
                attributes: ["ID", "name", "email", "password", "isAdmin"] // include ID explicitly
            });
        } catch (error) {
            throw new DbError("Failed to fetch user", {
                details: error.message,
                data: userID,
            });
        }
    }


    async createUser(userData)
    {
        try
        {
            return await this.User.create(userData);
        }
        catch(error)
        {
            throw new DbError("Failed to create user object", 
            {
               details: error.message,
               data: userData, 
            });
        }
    }

    async deleteUser(userID)
    {
        try
        {
            return await this.User.destroy(
            {
                where:
                {
                    [Op.or]: [ { ID: userID }, { name: userID }, { email: userID } ],
                }
            });
        }
        catch(error)
        {
            throw new DbError("Failed to delete user from database", { details: error.sqlMessage, data: { userID } });
        }
    }

    // async updateUser(userData, userID = userData.ID) {
    //     try {
    //         const allowedFields = ["name", "email", "password", "isAdmin"];

    //         const updateData = Object.fromEntries(
    //             Object.entries(userData)
    //                 .filter(([key]) => allowedFields.includes(key))
    //         );

    //         updateData.password && (updateData.password = authUtils.hashPassword(updateData.password));

    //         return await this.User.update(
    //             updateData,
    //             {
    //                 where: {
    //                     ID: userID
    //                 }
    //             }
    //         );
    //     }
    //     catch (error) {
    //         throw new DbError("Failed to update user", {
    //             details: error.message,
    //             data: { userID, userData }
    //         });
    //     }
    // }

    async updateUser(userID, userData) {
        try {
            const allowedFields = ["name", "email", "password", "isAdmin"];
            const updateData = Object.fromEntries(
                Object.entries(userData)
                    .filter(([key, value]) => allowedFields.includes(key) && value !== undefined)
            );

            if (updateData.password) {
                updateData.password = authUtils.hashPassword(updateData.password);
            }

            if (Object.keys(updateData).length === 0) {
                throw new BadRequestError("No valid fields to update");
            }

            await this.User.update(updateData, { where: { ID: userID } });

            return await this.User.findByPk(userID);
        } catch (error) {
            throw new DbError("Failed to update user", { 
                details: error.message, 
                data: { userID, userData } 
            });
        }
    }

    async updatePassword(password, userID) {
        if (!userID) throw new DbError("Missing User ID");
        if (!password) throw new DbError("Missing password");

        try {
            const [updatedCount] = await this.User.update(
                { password },
                { where: { ID: userID } }
            );

            if (updatedCount === 0) {
                throw new DbError("No user found to update", { data: { userID } });
            }

            const updatedUser = await this.User.scope("public").findOne({
                where: { ID: userID },
            });

            return updatedUser;
        } catch (error) {
            throw new DbError("Failed to update password", {
                details: error.message,
                data: { userID },
            });
        }
    }

    async updatePasswordByEmail(email, password) {
        if (!email) throw new Error("Missing email");
        if (!password) throw new Error("Missing password");

        try {
        const [updatedCount] = await this.User.update(
            { password },
            { where: { email } }
        );

        if (updatedCount === 0) {
            return 0;
        }

        return updatedCount;
        } catch (error) {
        throw new Error("Failed to update password: " + error.message);
        }
    }
}


module.exports = UserRepository;