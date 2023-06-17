const express = require('express');
const router = express.Router();
const passport = require('passport');
const jwt = require('jsonwebtoken');
const Admin = require('../models/Admin');
const config = require('../config/db');

router.post('/register', (req, res) => {
	let newAdmim = new Admin({
		name: req.body.name,
		username: req.body.username,
		email: req.body.email,
		contact: req.body.contact,
		password: req.body.password,
		job_profile: req.body.job_profile
	});
	Admin.addAdmin(newAdmim, (err, user) => {
		if(err){
			let message = "";
			if(err.errors.username) message = "Username already taken. ";
			if(err.errors.email) message += "Email already exists.";
			return res.json ({
				success: false,
				message
			});	 
		} else {
			return res.json({
				success: true,
				message: "Admin registration is successfull"
			})
		}
	});
});

router.post('/login', (req, res) => {
	const username = req.body.username;
	const password = req.body.password;
	Admin.getAdminByUsername(username, (err, admin) => {
		if(err) throw err;
		if(!admin) {
			return res.json({
				success: false,
				message: "Admin not found."
			});
		}

		Admin.comparePassword(password, admin.password, (err, isMatch) => {
			if(err) throw err;
			if(isMatch) {
				const token = jwt.sign({
					type: "admin",
					data: {
						_id: admin._id,
						username: admin.username,
						name: admin.name,
						email: admin.email,
						contact: admin.contact,
						job_profile: admin.job_profile
					}
					}, config.secret, {
						expiresIn: 604800 //time in 1 week
					}
				);
				return res.json({
					success: true,
					token: "JWT " + token
				});
			} else {
				return res.json({
					success: true,
					message: "Wrong Password"
				});
			}
		});
	});
});


//Get authenticated user profile
router.get('/profile', passport.authenticate('jwt', { session: false }), (req, res) => {
	return res.json(
		req.user
	)
})

module.exports = router;