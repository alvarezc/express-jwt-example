import jwt from "jsonwebtoken";
import crypto from "crypto";
import config from "../config";

/**
 * Generates hash for given password and salt with pbkdf2.
 *
 * @param {string} password the password to hash
 * @param {string} salt Base64 encoded salt
 * @returns {string} Base64 encoded hash
 */
export function hash(password, salt) {
  return crypto
    .pbkdf2Sync(password, Buffer.from(salt, "base64"), 100000, 64, "sha512")
    .toString("base64");
}

export default function(router) {
  router.post("/login", (req, res) => {
    /*
     * Check if the username and password is correct, use admin/admin
     */
    if (
      req.body.username === "admin" &&
      hash(
        req.body.password,
        "N0XkgsbgreNdoQE555cVf0pdpmna19XaiO+H5HRxzEftlBx61hjoJzBPCD+HB/ErfP3V9Im3gvEMwmnjwI1Zrg=="
      ) ===
        "BHvlJ3mcfECzRtLMj5MEkCClsRdY1xYfYSZNCoMMf1oviVkL5N/KPyL+pBYQ6KyfOaygF8+fwC5hBsH/9/uNpw=="
    ) {
      res.json({
        id: 1,
        username: "admin",
        jwt: jwt.sign(
          {
            id: 1
          },
          config.JWT_SECRET,
          { expiresIn: 60 * 60 }
        )
      });
    } else {
      /*
       * If the username or password was wrong, return 401 ( Unauthorized )
       * status code and JSON error message
       */
      res.status(401).json({
        error: {
          message: "Wrong username or password!"
        }
      });
    }
  });

  return router;
}
