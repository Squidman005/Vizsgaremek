const { BadRequestError, NotFoundError } = require("../errors");

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

        return await this.userRepository.updateUser(userData,userID)

    }
    async deleteUser(userID){
        if(!userID) throw new BadRequestError("Missing User ID");
        const user = await this.userRepository.deleteUser(userID);
        if(!user) throw new NotFoundError("Cannot find score whit this ID",{data:userID});
        return {success:true};

    }
}

module.exports = UserService;