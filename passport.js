const passport = require("passport"),
  LocalStrategy = require("passport-local").Strategy,
  Models = require("./models.js"),
  passportJWT = require("passport-jwt");

let Users = Models.User,
  JWTStrategy = passportJWT.Strategy,
  ExtractJWT = passportJWT.ExtractJwt;

// Use env-based secret; fallback only for local dev
const JWT_SECRET = process.env.JWT_SECRET || "development_jwt_secret";

passport.use(
  new LocalStrategy(
    {
      usernameField: "Username",
      passwordField: "Password",
    },
    async (username, password, done) => {
      try {
        const user = await Users.findOne({ Username: username });
        if (!user || !user.validatePassword(password)) {
          // Neutral message; avoid credential logging
          return done(null, false, { message: "Invalid credentials." });
        }
        return done(null, user);
      } catch (error) {
        return done(error);
      }
    }
  )
);

passport.use(
  new JWTStrategy(
    {
      jwtFromRequest: ExtractJWT.fromAuthHeaderAsBearerToken(),
      secretOrKey: JWT_SECRET,
      algorithms: ["HS256"],
    },
    async (jwtPayload, done) => {
      try {
        const user = await Users.findById(jwtPayload._id);
        if (!user) return done(null, false);
        return done(null, user);
      } catch (error) {
        return done(error);
      }
    }
  )
);
