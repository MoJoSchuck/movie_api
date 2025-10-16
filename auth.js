const jwtSecret = process.env.JWT_SECRET || "development_jwt_secret"; // Must match the JWTStrategy secret

const jwt = require("jsonwebtoken"),
  passport = require("passport");

require("./passport"); // Your local passport file

let generateJWTToken = (user) => {
  return jwt.sign(user, jwtSecret, {
    subject: user.Username, // encode username in JWT
    expiresIn: "7d", // token expires in 7 days
    algorithm: "HS256",
  });
};

/* POST login. */
module.exports = (router) => {
  router.post("/login", (req, res) => {
    passport.authenticate("local", { session: false }, (error, user, info) => {
      if (error) {
        return res
          .status(500)
          .json({ message: "Login failed", error: error.message });
      }
      if (!user) {
        // 401 for invalid credentials
        return res
          .status(401)
          .json({ message: info?.message || "Invalid credentials." });
      }
      req.login(user, { session: false }, (error) => {
        if (error)
          return res
            .status(500)
            .json({ message: "Login failed", error: error.message });
        const token = generateJWTToken(user.toJSON());
        return res.status(200).json({ user, token });
      });
    })(req, res);
  });
};
