jest.mock("../api/db");

const db = require("../api/db");
const { DbError, ValidationError } = require("../api/errors");

const UserRepository = require("../api/repositories/UserRepository");

const userRepository = new UserRepository(db);

describe("Repository tests", () => 
{
    describe("UserRepository", () => 
    {
        const users =
        [
            { name: "A",email:"A@email.com", password: "Apass" },
            { name: "B",email:"B@email.com", password: "Bpass" },
            { name: "C",email:"C@email.com", password: "Cpass" },
        ];

        let userResults;

        beforeAll(async () => 
        {
            await db.sequelize.sync();
        });

        beforeEach(async () => 
        {
            await db.User.bulkCreate(users);

            userResults = await userRepository.getUsers();
        });

        afterEach(async () => 
        {
            await db.User.destroy({ where: {} });

            jest.restoreAllMocks();
        });

        describe("getUsers method tests", () => 
        {
            test("getUsers returns correct values from db", async () => 
            {
                expect(userResults).toMatchObject(users);
            });

            test("the first user name must be A", () => 
            {
                expect(userResults[0].name).toEqual("A");
            });

            test("should throw DbError given the database is not setup correctly", async () => 
            {
                const userRepository = new UserRepository({});

                const promise = userRepository.getUsers();

                expect(promise).rejects.toThrow();

                expect(promise).rejects.toThrow("Failed fetching users");

                expect(promise).rejects.toThrow(DbError);
            })
        });

        describe("createUser method tests", () => 
        {
            test("should create a user in the database", async () => 
            {
                const user = { name: "E",email:"E@email.com", password: "Epass" };

                await userRepository.createUser(user);

                const users = await userRepository.getUsers();

                const foundUser = users.find(item => item.name == "E");

                expect(foundUser).toBeDefined();
            });

            test("should throw DbError given that the user already exists", async () => 
            {
                const user = 
                {
                    name: "TestUser",
                    capacity: 100,
                };

                await userRepository.createUser(user);

                const result = userRepository.createUser(user);

                await expect(result).rejects.toThrow(DbError);
            });

            test("should throw ValidationError when the capacity is not a floating point", async () => 
            {
                const user =
                {
                    name: "TestUser",
                    capacity: "onehundred",
                }

                const result = userRepository.createUser(user);

                await expect(result).rejects.toThrow(ValidationError);
            });

            test("should throw ValidationError when the capacity is less than one", async () => 
            {
                const user =
                {
                    name: "TestUser",
                    capacity: -7,
                }

                const result = userRepository.createUser(user);

                await expect(result).rejects.toThrow(ValidationError);
            });
        });
    });
})