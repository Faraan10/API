const express = require("express");
const router = express.Router();
const Products = require("../models/ProductModel");
const jwt = require("jsonwebtoken");

router.get("/", async (req, res) => {
	const products = await Products.find({});
	res.status(200).json(products);
});

// getting product by id
router.get("/:id", async (req, res) => {
	const id = req.params.id;

	if (!id) {
		res.status(400).json({ message: "No id" });
		return;
	}
	const data = await Products.findById(id);
	res.status(200).json(data);
});

router.post("/post", async (req, res) => {
	const { title, price, description, category, image } = req.body;

	const authtoken = req.headers.authtoken;

	if (!title || !price || !description || !category || !image) {
		res.status(400).json({ message: "All fields are required" });
		return;
	}

	const findProduct = await Products.findOne({
		title: title,
	});

	if (findProduct) {
		res.status(401).json({ message: "Product already exists" });
		return;
	}

	if (!authtoken) {
		res.status(401).json({ message: "No token" });
		return;
	}

	const decodetoken = jwt.decode(authtoken, process.env.SECRET_KEY);

	if (decodetoken.role !== "admin") {
		res.status(401).json({ message: "You are not Authorized" });
		return;
	}

	const createProduct = await Products.create({
		title: title,
		price: price,
		description: description,
		category: category,
		image: image,
	});

	res.status(200).json(createProduct);
});

router.put("/update/:id", async (req, res) => {
	const authtoken = req.headers.authtoken;
	const id = req.params.id;

	const decodeToken = jwt.decode(authtoken, process.env.SECRET_KEY);

	if (decodeToken.role !== "admin") {
		res.status(401).json({ message: "You are not Authorized" });
		return;
	}

	const { title, price, description, category, image } = req.body;

	const findProduct = await Products.findById(id);

	if (!findProduct) {
		res.status(401).json({ message: "Product does not exist" });
		return;
	}

	const updateProduct = await Products.findByIdAndUpdate(
		id,
		{
			title: title,
			price: price,
			description: description,
			category: category,
			image: image,
		},
		{ new: true }
	);

	res.status(200).json(updateProduct);
});

router.delete("/delete/:id", async (req, res) => {
	const id = req.params.id;
	const authtoken = req.headers.authtoken;

	if (!authtoken) {
		res.status(401).json({ message: "No token" });
		return;
	}

	const decodeToken = jwt.decode(authtoken, process.env.SECRET_KEY);

	if (decodeToken.role !== "admin") {
		res.status(401).json({ message: "You are not Authorized" });
		return;
	}

	const deleteProduct = await Products.findByIdAndDelete(id);

	res.status(200).json(deleteProduct);
});

module.exports = router;
