const passport = require("passport");
const JwtStrategy = require("passport-jwt").Strategy;
const LocalStrategy = require("passport-local").Strategy;
const GoogleTokenStrategy = require("passport-google-token").Strategy;
const FacebookTokenStrategy = require("passport-facebook-token");
const { ExtractJwt } = require("passport-jwt");
const {
  GOOGLE_CLIENT_ID,
  GOOGLE_CLIENT_SECRET,
  FACEBOOK_APP_ID,
  FACEBOOK_APP_SECRET,
} = require("../config/index");
const Users = require("../model/user");
passport.use(
  new JwtStrategy(
    {
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken("Authorization"),
      secretOrKey: process.env.TOKEN_KEY,
    },
    async (payload, done) => {
      try {
        const user = await Users.findById(payload.data);
        done(null, user);
      } catch (error) {
        done(error, false);
      }
    }
  )
);
passport.use(
  new LocalStrategy(
    {
      usernameField: "email",
    },
    async (email, password, done) => {
      try {
        const user = await Users.findOne({ email });
        if (!user) {
          return done(new Error("Email is not correct"), false);
        }
        const isMatch = await user.isValidPassword(password);
        if (!isMatch) {
          return done(new Error("Password is not correct"), false);
        } else if (user.userStatus === "INACTIVE") {
          return done(new Error("Your account is inactive"), false);
        } else if (user.userStatus === "UNCONFIRMED") {
          return done(
            new Error("Check your mail to verify your account"),
            false
          );
        }
        done(null, user);
      } catch (error) {
        done(error, false);
      }
    }
  )
);
passport.use(
  new GoogleTokenStrategy(
    {
      clientID: GOOGLE_CLIENT_ID,
      clientSecret: GOOGLE_CLIENT_SECRET,
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        const user = await Users.findOne({
          authGoogleID: profile.id,
          authType: "google",
        });
        if (user) return done(null, user);
        console.log(profile);

        const newUser = new Users({
          authType: "google",
          authGoogleID: profile.id,
          firstName: profile.name.givenName,
          lastName: profile.name.familyName,
          email: profile.emails[0].value,
          avatar: profile._json.picture,
        });
        await newUser.save();
        return done(null, newUser);
      } catch (error) {
        return done(null, false);
      }
    }
  )
);
passport.use(
  new FacebookTokenStrategy(
    {
      clientID: FACEBOOK_APP_ID,
      clientSecret: FACEBOOK_APP_SECRET,
      fbGraphVersion: "v3.0",
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        const user = await Users.findOne({
          authFacebookID: profile.id,
          authType: "facebook",
        });
        if (user) return done(null, user);
        let checkExist = Users.findOne({
          email: profile.emails[0].value,
        });
        if (checkExist) {
          throw new Error(
            "Your email is exist in our system, please sign in as a local user"
          );
        }
        //First time sign in with google
        const newUser = new Users({
          authType: "facebook",
          authFacebookID: profile.id,
          firstName: profile.name.givenName,
          lastName: profile.name.familyName,
          email: profile.emails[0].value,
          avatar: profile.photos[0].value,
        });
        await newUser.save();
        done(null, newUser);
      } catch (error) {
        done(null, false);
      }
    }
  )
);
