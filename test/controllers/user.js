import { expect } from "chai";
import { describe } from "mocha";
import request from "supertest";

import app from "../../server";
import { hash } from "../../controllers/user";

describe("user hash function", () => {
  const salt =
    "EaVndqguan3SctSMtElFZvl6YRKiO9aJp8CmFlkIMAdeZRkjMD6aEFepCKnyFANuJngf1S1NeTDz/r2VlllIGQ==";
  const validHash =
    "3ol4K0M8f8Se/3yiA+VdXWlDsBg9bHqaxeHZvlYh9RpUCewmSvHdJjgRX7IKi2Biglzlu0TFB8oPXyywkXYhFQ==";

  it("it should hash password", done => {
    const key = hash("admin", salt);

    expect(key).to.equal(validHash);

    done();
  });

  it("it should hash based on password", done => {
    const key = hash("administrator", salt);

    expect(key).to.not.equal(validHash);

    done();
  });

  it("it should hash based on salt", done => {
    const key = hash("admin", validHash);

    expect(key).to.not.equal(validHash);

    done();
  });
});

describe("POST /login", () => {
  it("it responds with 401 status code if bad username or password", done => {
    request(app)
      .post("/login")
      .type("json")
      .send('{"username":"bad","password":"wrong"}')
      .expect(401)
      .end(err => {
        if (err) return done(err);
        done();
      });
  });

  it("it responds with 200 status code if good username or password", done => {
    request(app)
      .post("/login")
      .type("json")
      .send('{"username":"admin","password":"admin"}')
      .expect(200)
      .end(err => {
        if (err) return done(err);
        done();
      });
  });

  it("it returns JWT token if good username or password", done => {
    request(app)
      .post("/login")
      .type("json")
      .send('{"username":"admin","password":"admin"}')
      .end(function(err, res) {
        if (err) return done(err);

        expect(res.body).have.property("jwt");

        done();
      });
  });
});
