const { BadRequestError, NotFoundError } = require("../errors");
const authUtils = require("../utilities/authUtils");
const { sendEmail } = require("../utilities/emailUtils");

class UserService
{
    constructor(db)
    {
        this.userRepository = require("../repositories")(db).userRepository;
    }

    async getUsers()
    {
        return await this.userRepository.getUsers();
    }

    async getUsersWithPassword()
    {
        return await this.userRepository.getUsersWithPassword();
    }

    async getUser(userID)
    {
        if(!userID) throw new BadRequestError("Missing user identification from payload");

        const user = await this.userRepository.getUser(userID);

        if(!user) throw new NotFoundError("Can not find user with this user identification", 
        {
            data: userID
        });

        return user;
    }

    async createUser(userData)
    {
        if(!userData) throw new BadRequestError("Missing user data from payload", 
        {
            data: userData,
        });

        if(!userData.name) throw new BadRequestError("Missing username from payload",
        {
            data: userData,
        });

        if(!userData.password) throw new BadRequestError("Missing password from payload", 
        {
            data: userData,
        });

        if(!userData.email) throw new BadRequestError("Missing email from payload", 
        {
            data: userData,
        });

        return await this.userRepository.createUser(userData);
    }
    async updateUser(userID,userData){
        if(!userID) throw new BadRequestError("Missing User ID");
        if (!userData || Object.keys(userData).length === 0) throw new BadRequestError("Missing user data", { data: userID });

        if(!userData.name) throw new BadRequestError("Missing username from payload",
        {
            data: userData,
        });

        if(!userData.password) throw new BadRequestError("Missing password from payload", 
        {
            data: userData,
        });

        if(!userData.email) throw new BadRequestError("Missing email from payload", 
        {
            data: userData,
        });

        if (userData.isAdmin === undefined || userData.isAdmin === null) throw new BadRequestError("Missing isAdmin from payload",
        { 
            data: userData 
        });

        return await this.userRepository.updateUser(userData,userID)

    }

    async updatePassword(password, userID) {
        if (!userID) throw new BadRequestError("Missing User ID");
        if (!password) throw new BadRequestError("Missing password");

        return await this.userRepository.updatePassword(password, userID);
    }

    async updateUsername(name, userID) {
        if (!userID) throw new BadRequestError("Missing User ID");
        if (!name) throw new BadRequestError("Missing username");

        return await this.userRepository.updateUsername(name, userID);
    }
    
    async deleteUser(userID){
        if(!userID) throw new BadRequestError("Missing User ID");
        return await this.userRepository.deleteUser(userID);
    }

    async resetPasswordByEmail(email, password) {
        if (!email) throw new BadRequestError("Email is required");
        if (!password) throw new BadRequestError("Password is required");

        const updatedCount = await this.userRepository.updatePasswordByEmail(email, password);

        if (!updatedCount) {
        throw new NotFoundError("Cannot find user with this email", { data: email });
        }

        await sendEmail({
        to: email,
        subject: "Jelszó visszaállítva",
        html: `<p>Az új jelszavad: <strong>${password}</strong></p>`,
        });

        return { success: true };
    }
}

module.exports = UserService;