const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const uniqueValidator = require('mongoose-unique-validator');

//Define our user schema
const UserSchema = mongoose.Schema({
	name:{
		type: String,
		required: true
	},
	email:{
		type: String,
		unique: true,
		index: true,
		required: true
	},
	username:{
		type: String,
		unique: true,
		required: true
	},
	password:{
		type: String,
		required: true
	},
	contact:{
		type: String,
		required: true
	}
});

UserSchema.plugin(uniqueValidator);

const User = module.exports = mongoose.model('User', UserSchema);

//find User by id
module.exports.getUserById = function(id, callback){
	User.findById(id, callback);
}

// find User by username
module.exports.getUserByUsername = function(username, callback){
	const query = {
		username:username
	}
	User.findOne(query, callback);
}

// register User
module.exports.addUser = function(newUser, callback){
	bcrypt.genSalt(10, (err, salt) => {
		bcrypt.hash(newUser.password, salt, (err, hash) => {
			if(err) throw err;
			newUser.password = hash;
			newUser.save(callback);
		});
	});
}

//compare password when user logs in
// find User by username
module.exports.comparePassword = function(password, hash, callback){
	bcrypt.compare(password, hash, (err, isMatch) => {
		if(err) throw err;
		callback(null, isMatch);
	});
}

