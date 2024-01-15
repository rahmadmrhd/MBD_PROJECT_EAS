import supertest from "supertest";
import app from "../../app/app";
import db from "../../app/database";

describe("POST /auth/employee", () => {
  // afterEach(async () => {
  //   await db.query("DELETE FROM customer where username = 'rahmadm_rhd'");
  // });

  it("should can register new customer", async () => {
    const result = await supertest(app)
      .post("/auth/employee")
      .send({
        username: "rahmadm_rhd",
        password: "password",
        name: "Rahmad Maulana",
        gender: "L",
        birthdate: new Date(2003, 1, 8),
      });

    expect(result.status).toBe(200);
    expect(result.body.data.username).toBe("rahmadm_rhd");
    expect(result.body.data.name).toBe("Rahmad Maulana");
    expect(result.body.data.password).toBeUndefined();
  });
});
