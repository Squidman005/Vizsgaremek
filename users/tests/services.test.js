const { BadRequestError } = require("../api/errors");

const { userService } = require("../api/services")({});

describe("Service tests", () => 
{
    describe("UserService", () => 
    {
        beforeAll(() => 
        {
            userService.repository.getUsers = jest.fn().mockReturnValue(true);
            userService.repository.createUser = jest.fn().mockReturnValue(true);
        });

        describe("getUsers", () => 
        {
            test("should return all the users", async () => 
            {
                const result = await userService.getUsers();

                expect(result).toBeTruthy();
            });
        });

        describe("createUser", () => 
        {
            /*
            NOTE: Tesztesetek
                - Sikeres eset
                Hibák:
                - Hiányos adat
                - Nem megfelelő adat
                SQL hibák:
                - Már létező egyed
                - Validációs hibák
            */

            test("should create a new user", async () => 
            {
                const userData =
                {
                    name: "TestUser",
                    email: "Test@email.com",
                    password:"Testpass",
                };

                const result = await userService.createUser(userData);

                expect(result).toBeTruthy();
            });

            test("should throw BadRequestError given that there is no data", async () => 
            {
                const result = userService.createUser(undefined);

                await expect(result).rejects.toThrow(BadRequestError);
            });

            test("should throw BadRequestError given that the payload is missing attributes", async () => 
            {
                const user = 
                {
                    name: "TestUser",
                };

                const result = userService.createUser(user);

                await expect(result).rejects.toThrow(BadRequestError);
            });
        });
    });
});
