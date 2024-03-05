const express = require("express");
const router = express.Router();
const User = require("../models/UserModel");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

router.get("/", async (req, res) => {
	const data = await User.find({});
	res.status(200).json(data);
});

router.get("/user", async (req, res) => {
	const token = req.headers.authtoken;

	if (!token) {
		res.status(400).json({ message: "No token" });
		return;
	}

	const decodeToken = jwt.decode(token, process.env.SECRET_KEY);

	res.status(200).json(decodeToken);
});

router.post("/register", async (req, res) => {
	const { username, email, password, role } = req.body;

	if (!username || !email || !password) {
		res.status(400).json({ message: "You have not filled the required fields" });
		return;
	}

	const checkUser = await User.findOne({
		email: email,
	});

	if (checkUser) {
		res.status(401).json({ message: "User with this email already exists" });
		return;
	}
	const hashPassword = await bcrypt.hash(password, 10);

	const createUser = await User.create({
		username: username,
		email: email,
		password: hashPassword,
		role: role,
	});

	res.status(200).json(createUser);
});

router.post("/login", async (req, res) => {
	const { email, password } = req.body;

	if (!email || !password) {
		res.status(400).json({ message: "You have not filled the required fields" });
		return;
	}

	const checkUser = await User.findOne({
		email: email,
	});

	if (!checkUser) {
		res.status(401).json({ message: "User does not exist" });
		return;
	}

	const comparePassword = await bcrypt.compare(password, checkUser.password);

	if (!comparePassword) {
		res.status(401).json({ message: "Invalid Login Credentials" });
		return;
	}

	const token = jwt.sign(
		{
			username: checkUser.username,
			email: checkUser.email,
			role: checkUser.role,
		},
		process.env.SECRET_KEY
	);

	res.status(200).json(token);
});

router.put("/update/:id", async (req, res) => {
	const id = req.params.id;
	const { username, email, password, role } = req.body;

	const checkUser = await User.findById(id);

	if (!checkUser) {
		res.status(401).json({ message: "User does not exist" });
		return;
	}

	const hashPassword = await bcrypt.hash(password, 10);

	const updateUser = await User.findByIdAndUpdate(
		id,
		{
			username: username,
			email: email,
			password: hashPassword,
			role: role,
		},
		{ new: true }
	);

	res.status(200).json(updateUser);
});

router.delete("/delete/:id", async (req, res) => {
	const id = req.params.id;

	const checkUser = await User.findById(id);

	if (!checkUser) {
		res.status(401).json({ message: "User does not exist" });
		return;
	}

	const deleteUser = await User.findByIdAndDelete(id);

	res.status(200).json(deleteUser);
});

module.exports = router;
