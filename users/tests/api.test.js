const request = require("supertest");
const app = require("../app");
const jwt = require("jsonwebtoken");

jest.mock("../api/db"); 
const db = require("../api/db");

process.env.JWT_SECRET = "test_secret_key";

const generateTestToken = (payload) => {
    return jwt.sign(payload, process.env.JWT_SECRET);
};

describe("API Integrációs Tesztek", () => {

    beforeAll(async () => {
        await db.sequelize.sync({ force: true }); 
    });

    afterAll(async () => {
        await db.sequelize.close();
    });

    describe("User API & Auth Tests", () => {
        let standardUserId;
        let adminUserId;

        beforeAll(async () => {
            const standardUser = await db.User.create({
                name: "testuser",
                email: "test@example.com",
                password: "password123",
                isAdmin: false
            });
            standardUserId = standardUser.ID;

            const adminUser = await db.User.create({
                name: "adminuser",
                email: "admin@example.com",
                password: "password123",
                isAdmin: true
            });
            adminUserId = adminUser.ID;
        });

        describe("POST /api/auth/login", () => {
            it("Sikeres bejelentkezés esetén tokent és sütit ad vissza", async () => {
                const response = await request(app)
                    .post("/api/auth/login")
                    .send({ userID: "testuser", password: "password123" });

                expect(response.status).toBe(200);
                expect(response.body).toHaveProperty("token");
                expect(response.headers["set-cookie"]).toBeDefined();
            });

            it("Hiba 400, ha hiányoznak a belépési adatok", async () => {
                const response = await request(app)
                    .post("/api/auth/login")
                    .send({ userID: "" });

                expect(response.status).toBe(400);
            });

            it("Hiba 401, ha rossz a jelszó", async () => {
                const response = await request(app)
                    .post("/api/auth/login")
                    .send({ userID: "testuser", password: "wrongpassword" });

                expect(response.status).toBe(401);
            });
        });

        describe("GET /api/users", () => {
            it("Admin jogosultság szükséges a lista lekéréséhez", async () => {
                const adminToken = generateTestToken({ userID: adminUserId, isAdmin: true });

                const response = await request(app)
                    .get("/api/users")
                    .set("Cookie", [`user_token=${adminToken}`]);

                expect(response.status).toBe(200);
                expect(Array.isArray(response.body)).toBe(true);
            });

            it("401-et ad vissza, ha nincs bejelentkezve", async () => {
                const response = await request(app).get("/api/users");
                expect(response.status).toBe(401);
            });

            it("401-et (Unauthorized) ad vissza, ha nem admin", async () => {
                const userToken = generateTestToken({ userID: standardUserId, isAdmin: false });
                
                const response = await request(app)
                    .get("/api/users")
                    .set("Cookie", [`user_token=${userToken}`]);

                expect(response.status).toBe(401); 
            });
        });

        describe("PATCH /api/users/:userID", () => {
            it("Sikeresen frissíti a felhasználót", async () => {
                const updatedData = { 
                    username: "updated_testuser", 
                    email: "updated@example.com", 
                    password: "newpassword123",
                    isAdmin: false 
                };

                const response = await request(app)
                    .patch(`/api/users/${standardUserId}`)
                    .send(updatedData);

                expect(response.status).toBe(200);
                expect(response.body.name).toBe("updated_testuser");
            });
        });

        describe("DELETE /api/users/:userID", () => {
            it("Törli a felhasználót és a hozzá tartozó pontszámokat", async () => {
                const userToDelete = await db.User.create({
                    name: "deleteme",
                    email: "delete@example.com",
                    password: "password123",
                    isAdmin: false
                });

                if (db.Score) {
                    await db.Score.create({
                        userId: "deleteme",
                        score: 100,
                        gamename: "test_game"
                    });
                }

                const response = await request(app).delete(`/api/users/${userToDelete.ID}`);
                expect(response.status).toBe(204);

                const dbCheckUser = await db.User.findByPk(userToDelete.ID);
                expect(dbCheckUser).toBeNull();
            });
        });
    });

    describe("Score API Tests", () => {
        let scoreIdToUpdate;

        beforeAll(async () => {
            const s1 = await db.Score.create({ userId: "player1", score: 50, gamename: "Tetris" });
            scoreIdToUpdate = s1.ID;
            
            await db.Score.create({ userId: "player1", score: 150, gamename: "Tetris" });
            await db.Score.create({ userId: "player2", score: 300, gamename: "Pacman" });
            await db.Score.create({ userId: "player1", score: 80, gamename: "Pacman" });
        });

        describe("GET /api/score", () => {
            it("Lekéri az összes pontszámot", async () => {
                const response = await request(app).get("/api/score");
                
                expect(response.status).toBe(200);
                expect(Array.isArray(response.body)).toBe(true);
                expect(response.body.length).toBeGreaterThanOrEqual(4);
            });
        });

        describe("GET /api/score/:gamename", () => {
            it("Lekéri a top 10 pontszámot játéknév alapján csökkenő sorrendben", async () => {
                const response = await request(app).get("/api/score/Tetris");
                
                expect(response.status).toBe(200);
                expect(Array.isArray(response.body)).toBe(true);
                expect(response.body[0].score).toBe(150);
                expect(response.body[1].score).toBe(50);
            });
        });

        describe("GET /api/score/player/:playername", () => {
            it("Lekéri egy játékos legjobb pontszámát minden játékához", async () => {
                const response = await request(app).get("/api/score/player/player1");
                
                expect(response.status).toBe(200);
                expect(Array.isArray(response.body)).toBe(true);
                
                const tetrisBest = response.body.find(s => s.gamename === "Tetris");
                const pacmanBest = response.body.find(s => s.gamename === "Pacman");

                expect(tetrisBest.score).toBe(150);
                expect(pacmanBest.score).toBe(80);
            });
        });

        describe("POST /api/score", () => {
            it("Sikeresen létrehoz egy új pontszámot", async () => {
                const newScore = {
                    userId: "newplayer",
                    score: 500,
                    gamename: "Doom"
                };

                const response = await request(app)
                    .post("/api/score")
                    .send(newScore);

                expect([200, 201]).toContain(response.status); 

                const dbCheck = await db.Score.findOne({ where: { userId: "newplayer" } });
                expect(dbCheck.score).toBe(500);
            });

            it("Hibát (400) ad, ha hiányzik a játéknév", async () => {
                const badScore = {
                    userId: "newplayer",
                    score: 100
                };

                const response = await request(app)
                    .post("/api/score")
                    .send(badScore);

                expect(response.status).toBe(400);
            });
        });

        describe("PATCH /api/score/:scoreID", () => {
            it("Sikeresen frissíti egy meglévő pontszámot", async () => {
                const updatedScoreData = {
                    ID: scoreIdToUpdate,
                    userId: "player1",
                    score: 999, 
                    gamename: "Tetris"
                };

                const response = await request(app)
                    .patch(`/api/score/${scoreIdToUpdate.toString()}`).send(updatedScoreData);

                expect(response.status).toBe(200);

                const dbCheck = await db.Score.findByPk(scoreIdToUpdate);
                expect(dbCheck.score).toBe(999);
            });
        });

        describe("DELETE /api/score/:scoreID", () => {
            it("Sikeresen töröl egy pontszámot", async () => {
                const scoreToDelete = await db.Score.create({
                    userId: "deleteme",
                    score: 10,
                    gamename: "TestGame"
                });

                const response = await request(app).delete(`/api/score/${scoreToDelete.ID}`);
                
                expect([200, 204]).toContain(response.status);

                const dbCheck = await db.Score.findByPk(scoreToDelete.ID);
                expect(dbCheck).toBeNull();
            });
        });
    });
});