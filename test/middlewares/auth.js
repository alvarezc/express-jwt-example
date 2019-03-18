import { expect } from "chai";
import sinon from "sinon";
import jwt from "jsonwebtoken";
import { describe } from "mocha";

import auth from "../../middlewares/auth.js";
import config from "../../config.js";

describe("Test Auth Middleware", () => {
  let request;
  let response;
  let next;

  beforeEach(() => {
    request = {};
    response = {
      status: sinon.stub().returnsThis(),
      json: sinon.spy()
    };
    next = sinon.spy();
  });

  it("next should not be called if no token provided", () => {
    auth(request, response, next);
    expect(next.called).to.equal(false);
  });

  it("should return 401 status code if no token provided", () => {
    auth(request, response, next);
    expect(response.status.getCall(0).args[0]).to.equal(401);
  });

  it("next should not be called if bad token was provided", () => {
    request.headers = {};
    request.headers.authorization = "some authorization header";
    auth(request, response, next);
    expect(next.called).to.equal(false);
  });

  it("shoudl return 401 status code if bad token was provided", () => {
    request.headers = {};
    request.headers.authorization = "some authorization header";
    auth(request, response, next);
    expect(response.status.getCall(0).args[0]).to.equal(401);
  });

  it("request should contain user info if good token was provided", () => {
    request.headers = {};
    request.headers.authorization = jwt.sign({ id: 1 }, config.JWT_SECRET);
    auth(request, response, next);
    expect(request).to.have.property("user");
    expect(request.user).to.have.property("id");
    expect(request.user.id).to.be.equal(1);
  });

  it("next should be called once if good token was provided", () => {
    request.headers = {};
    request.headers.authorization = jwt.sign({ id: 1 }, config.JWT_SECRET);
    auth(request, response, next);
    expect(next.calledOnce).to.equal(true);
  });
});
