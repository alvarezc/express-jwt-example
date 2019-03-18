import request from "supertest";
import jwt from "jsonwebtoken";
import { describe } from "mocha";

import app from "../../server";
import config from "../../config";

describe("GET /hello-world", () => {
  // Original code was actually returning /api/hello-world here
  it("it should return 404", done => {
    request(app)
      .get("/hello-world")
      .expect(404)
      .end(err => {
        if (err) return done(err);
        done();
      });
  });
});

describe("GET /api/hello-world", () => {
  it("it responds with 401 status code if no authorization header", done => {
    request(app)
      .get("/api/hello-world")
      .expect(401)
      .end(err => {
        if (err) return done(err);
        done();
      });
  });

  it("it responds with JSON if no authorization header", done => {
    request(app)
      .get("/api/hello-world")
      .expect("Content-Type", /json/)
      .end(err => {
        if (err) return done(err);
        done();
      });
  });

  it("it responds with 200 status code if good authorization header", done => {
    const token = jwt.sign(
      {
        id: 1
      },
      config.JWT_SECRET,
      { expiresIn: 60 * 60 }
    );

    request(app)
      .get("/api/hello-world")
      .set("Authorization", token)
      .expect(200)
      .end(err => {
        if (err) return done(err);
        done();
      });
  });

  it("it responds with JSON if good authorization header", done => {
    const token = jwt.sign(
      {
        id: 1
      },
      config.JWT_SECRET,
      { expiresIn: 60 * 60 }
    );

    request(app)
      .get("/api/hello-world")
      .set("Authorization", token)
      .expect("Content-Type", /json/)
      .end(err => {
        if (err) return done(err);
        done();
      });
  });
});
