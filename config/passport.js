const JwtStrategy = require('passport-jwt').Strategy;
const ExtractJwt = require('passport-jwt').ExtractJwt;

//autheticate the User
const User = require('../models/User');
const Admin = require('../models/Admin');
const config = require('../config/db');

//To autheticate the User by JWT strategy
module.exports = (userType, passport) => {
	let opts = {};
	opts.jwtFromRequest = ExtractJwt.fromAuthHeaderWithScheme('jwt');
	opts.secretOrKey = config.secret;
	passport.use(new JwtStrategy(opts, (jwt_payload, done) => {
		if(userType == 'admin') {
			Admin.getAdminById(jwt_payload.data._id, (err, user) => {
			if(err) return done(err, false);
			if(user) return done(null, user);
			return done(null, false);
		});

		}
		if(userType == 'users') {
			User.getUserById(jwt_payload.data._id, (err, user) => {
			if(err) return done(err, false);
			if(user) return done(null, user);
			return done(null, false);
		});
		}
	}));
}