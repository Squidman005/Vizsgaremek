jest.mock("../api/db");

const request = require("supertest");

const app = require("../app");

const db = require("../api/db");

describe("API Tests", () => 
{
    beforeAll(async () => 
    {
        await db.sequelize.sync();
    });

    describe("/api/users", () => 
    {
        const users = 
        [
            { name: "A",email:"A@email.com", password: "Apass" },
            { name: "B",email:"B@email.com", password: "Bpass" },
            { name: "C",email:"C@email.com", password: "Cpass" },

        ];

        
        console.log(db.User);
        beforeEach(async () => 
        {
            await db.User.bulkCreate(users);
        });

        afterEach(async () => 
        {
            await db.User.destroy({ where: {} });
        });

        describe("GET", () => 
        {
            test("should return all the users", async () => 
            {
                const res = await request(app).get("/api/users")
                .set("Accept", "application/json");

                expect(res.status).toBe(200);

                expect(res.type).toMatch(/json/);

                expect(res.body).toMatchObject(users);
            });
        });

        describe("POST", () => 
        {
            test("should create a user", async () => 
            {

                const user = { name: "D",email:"D@email.com", password: "Dpass" };

                const res = await request(app).post("/api/users").send(user);

                expect(res.status).toBe(201);
                expect(res.type).toMatch(/json/);
                expect(res.body).toMatchObject(user);

                const founduser = await db.User.findOne(
                {
                    where:
                    {
                        name: "D",
                    }
                });

                expect(founduser).toBeDefined();
                expect(founduser.name).toEqual("D");
                expect(founduser.email).toEqual("D@email.com");
                expect(founduser.password).toEqual("Dpass");
            });
        });

        describe("DELETE", () => 
        {
            test("should delete user", async () => 
            {
                const res = await request(app).delete("/api/users/B");

                const founduser = await db.User.findOne(
                {
                    where:
                    {
                        name: "B",
                    }
                });

                expect(res.status).toBe(200);
                expect(res.type).toMatch(/json/);


                expect(founduser).not.toBeDefined();
                expect(db.User.length).toBe(2);
            });
        });
    });
});